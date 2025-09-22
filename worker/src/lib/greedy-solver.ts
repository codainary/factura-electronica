export function solveGreedy(edges: any[]) {
  const byInvPaid: Record<number, number> = {};
  const byTxUsed: Record<number, number> = {};
  const allocs: any[] = [];
  for (const e of edges.sort((a,b)=> b.score - a.score)) {
    const txRemain = (e.amount - (byTxUsed[e.txId] || 0));
    const invRemain = (e.saldo - (byInvPaid[e.invoiceId] || 0));
    if (txRemain <= 0 || invRemain <= 0) continue;
    const allocate = Math.min(txRemain, invRemain);
    allocs.push({ txId: e.txId, invoiceId: e.invoiceId, allocated: allocate, score: e.score, reasons: e.reasons });
    byTxUsed[e.txId] = (byTxUsed[e.txId] || 0) + allocate;
    byInvPaid[e.invoiceId] = (byInvPaid[e.invoiceId] || 0) + allocate;
  }
  return allocs;
}
