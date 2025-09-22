const invoiceRegex = /(FAC[-_ ]?\d{3,})/i;
export async function extractFeatures(txs: any[]) {
  return txs.map(t => ({ txId: t.id, hasInvoicePattern: invoiceRegex.test(t.description) }));
}
