import axios from 'axios';
const ML = process.env.ML_BASE_URL || 'http://ml:8000';

export async function generateCandidates(txs: any[], invoices: any[], feats: any[]) {
  const results: any[] = [];
  for (const t of txs) {
    const { data } = await axios.post(`${ML}/candidates`, { description: t.description, top_k: 5, invoice_numbers: invoices.map(i => i.number) });
    for (const cand of data.candidates) {
      const inv = invoices.find(i => i.number === cand.number);
      if (!inv) continue;
      results.push({ tx: t, inv, signals: { simText: cand.sim, amount: t.amount, saldo: Number(inv.total) - Number(inv.paid), days: daysBetween(t.postedAt, inv.dueDate ?? inv.issueDate) } });
    }
  }
  return results;
}
function daysBetween(a: Date, b: Date) { return Math.abs((+a - +b) / 86400000); }
