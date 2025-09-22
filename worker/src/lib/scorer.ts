import axios from 'axios';
const ML = process.env.ML_BASE_URL || 'http://ml:8000';

export async function scoreEdges(cands: any[]) {
  const edges:any[] = [];
  for (const c of cands) {
    const { data } = await axios.post(`${ML}/score`, {
      sim_text: c.signals.simText,
      delta_days: c.signals.days,
      amount: c.signals.amount,
      saldo: c.signals.saldo,
    });
    edges.push({ txId: c.tx.id, invoiceId: Number(c.inv.id), score: data.score, amount: c.signals.amount, saldo: c.signals.saldo, reasons: data.reasons });
  }
  return edges;
}
