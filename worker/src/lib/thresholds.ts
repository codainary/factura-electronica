export function applyThresholds(allocs: any[]) {
  const tauAuto = 0.88; const tauReview = 0.70;
  const auto:any[] = []; const review:any[] = [];
  for (const a of allocs) {
    const safetyFail = a.allocated <= 0 || a.score < 0.5;
    if (safetyFail) { review.push({ ...a, reason: 'SAFETY_FAIL' }); continue; }
    if (a.score >= tauAuto) auto.push(a);
    else if (a.score >= tauReview) review.push(a);
  }
  return { auto, review };
}
