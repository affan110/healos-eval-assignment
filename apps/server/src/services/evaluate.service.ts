import * as fuzz from "fuzzball";

export function evaluate(pred: any, gold: any, transcript: string) {
  return {
    chief_complaint: fuzzy(pred?.chief_complaint, gold?.chief_complaint),
    vitals: evalVitals(pred?.vitals, gold?.vitals),
    medications: setF1(pred?.medications, gold?.medications),
    diagnoses: setF1(pred?.diagnoses, gold?.diagnoses),
    plan: setF1(pred?.plan, gold?.plan),
    follow_up: evalFollowUp(pred?.follow_up, gold?.follow_up),
    hallucination: detectHallucination(pred, transcript),
  };
}

function fuzzy(a: string, b: string) {
  return fuzz.token_set_ratio(a || "", b || "") / 100;
}

function evalVitals(p: any, g: any) {
  let score = 0;
  let total = 0;

  for (let key of ["bp", "hr", "temp_f", "spo2"]) {
    total++;
    if (p?.[key] === g?.[key]) score++;
  }

  return score / total;
}

function setF1(pred: any[], gold: any[]) {
  const p = new Set((pred || []).map((x) => JSON.stringify(x)));
  const g = new Set((gold || []).map((x) => JSON.stringify(x)));

  const intersection = [...p].filter((x) => g.has(x)).length;

  const precision = intersection / (p.size || 1);
  const recall = intersection / (g.size || 1);

  return (2 * precision * recall) / (precision + recall || 1);
}

function evalFollowUp(p: any, g: any) {
  return p?.interval_days === g?.interval_days ? 1 : 0;
}

function detectHallucination(pred: any, text: string) {
  if (!pred) return 1;

  let count = 0;
  const content = JSON.stringify(pred).toLowerCase();
  const t = text.toLowerCase();

  for (let word of content.split(/\W+/)) {
    if (word.length > 5 && !t.includes(word)) {
      count++;
    }
  }

  return count;
}