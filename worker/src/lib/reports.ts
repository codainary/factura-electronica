export async function emitReports({ runId, auto, review }: any) {
  console.log(`[run ${runId}] auto=${auto.length} review=${review.length}`);
}
