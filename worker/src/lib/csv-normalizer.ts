import { parse } from 'csv-parse/sync';

export type Tx = { id: number; postedAt: Date; amount: number; description: string; bank: string };

export async function normalizeCsv(buf: Buffer, bank: string): Promise<Tx[]> {
  const rows = parse(buf, { columns: true, skip_empty_lines: true });
  return rows.map((r: any, idx: number) => ({
    id: idx + 1,
    postedAt: new Date(r.postedAt),
    amount: Number(r.amount),
    description: String(r.description || ''),
    bank,
  }));
}
