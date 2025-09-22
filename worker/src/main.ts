import { Worker, Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { normalizeCsv } from './lib/csv-normalizer';
import { extractFeatures } from './lib/features';
import { generateCandidates } from './lib/candidates';
import { scoreEdges } from './lib/scorer';
import { solveGreedy } from './lib/greedy-solver';
import { applyThresholds } from './lib/thresholds';
import { emitReports } from './lib/reports';

const prisma = new PrismaClient();
const connection = { host: process.env.REDIS_HOST!, port: parseInt(process.env.REDIS_PORT || '6379') };

new Worker('reconcile', async (job: Job) => {
  const run = await prisma.reconciliationRun.create({ data: { rulesetVersion: 'rules@1.0.0', modelVersion: 'clf@v1' } });
  try {
    const csv = "postedAt,amount,description\n2025-09-15,1200000,FAC-1001 pago\n2025-09-16,1000000,FAC-1002 pago\n";
    const buf = Buffer.from(csv, 'utf8');

    const txs = await normalizeCsv(buf, job.data.bank || 'UNKNOWN');
    const invoices = await prisma.invoice.findMany({ where: { status: { in: ['OPEN', 'PARTIAL'] } } });

    const feats = await extractFeatures(txs);
    const cands = await generateCandidates(txs, invoices, feats);
    const edges = await scoreEdges(cands);
    const allocs = solveGreedy(edges);
    const { auto, review } = applyThresholds(allocs);

    for (const a of auto) {
      await prisma.reconciliationMatch.create({ data: {
        invoiceId: BigInt(a.invoiceId),
        bankTxId: BigInt(a.txId),
        allocated: a.allocated.toString(),
        score: a.score,
        reasonCodes: a.reasons,
      }});
      const inv = invoices.find(x => Number(x.id) === a.invoiceId)!;
      const newPaid = (Number(inv.paid) + a.allocated);
      const status = newPaid >= Number(inv.total) ? 'PAID' : (newPaid > 0 ? 'PARTIAL' : 'OPEN');
      await prisma.invoice.update({ where: { id: inv.id }, data: { paid: newPaid.toString(), status } });
    }

    await emitReports({ runId: run.id, auto, review });
    await prisma.reconciliationRun.update({ where: { id: run.id }, data: { finishedAt: new Date(), metrics: { auto: auto.length, review: review.length } } });
    return { ok: true, auto: auto.length, review: review.length };
  } catch (e:any) {
    await prisma.reconciliationRun.update({ where: { id: run.id }, data: { finishedAt: new Date(), metrics: { error: String(e) } } });
    throw e;
  }
}, { connection });
