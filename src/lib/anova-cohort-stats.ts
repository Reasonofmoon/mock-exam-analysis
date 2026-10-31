/**
 * src/lib/anova-cohort-stats.ts
 * ─────────────────────────────────────────
 * REA Track 5 (#036 G*Power 3.1 ANOVA & Effect Size Engine):
 * One-Way ANOVA (F-ratio, eta-squared, Cohen's f) across academy cohorts/rounds
 * + 3-Point Killer Question Discrimination Index (D = P_upper27% - P_lower27%).
 */

import type { StudentExam } from "../types/exam.ts";

export interface CohortGroupSummary {
  groupName: string;
  count: number;
  mean: number;
  stdDev: number;
}

export interface AnovaCohortReport {
  groupSummaries: CohortGroupSummary[];
  dfBetween: number;
  dfWithin: number;
  ssBetween: number;
  ssWithin: number;
  fStatistic: number;
  etaSquared: number;
  cohensF: number;
  effectMagnitude: "negligible" | "small" | "medium" | "large";
}

export interface QuestionDiscriminationMetric {
  questionNumber: number;
  isThreePoint: boolean;
  correctRate: number;
  upperCohortRate: number;
  lowerCohortRate: number;
  discriminationIndex: number;
  classification: "high_discriminator" | "moderate_discriminator" | "low_discriminator";
}

/**
 * Computes One-Way ANOVA and G*Power 3.1 (#036) Cohen's f effect size across
 * two or more student score groups (e.g., classes, grades, or mock exam rounds).
 */
export function computeOneWayAnova(groups: Record<string, number[]>): AnovaCohortReport {
  const entries = Object.entries(groups).filter(([, arr]) => arr.length > 0);
  const k = entries.length;
  const allScores = entries.flatMap(([, arr]) => arr);
  const totalN = allScores.length;

  if (k < 2 || totalN <= k) {
    return {
      groupSummaries: entries.map(([name, arr]) => ({
        groupName: name,
        count: arr.length,
        mean: arr.length ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)) : 0,
        stdDev: 0,
      })),
      dfBetween: Math.max(0, k - 1),
      dfWithin: Math.max(0, totalN - k),
      ssBetween: 0,
      ssWithin: 0,
      fStatistic: 0,
      etaSquared: 0,
      cohensF: 0,
      effectMagnitude: "negligible",
    };
  }

  const grandMean = allScores.reduce((a, b) => a + b, 0) / totalN;
  let ssBetween = 0;
  let ssWithin = 0;

  const groupSummaries: CohortGroupSummary[] = entries.map(([name, arr]) => {
    const n = arr.length;
    const mean = arr.reduce((a, b) => a + b, 0) / n;
    ssBetween += n * (mean - grandMean) ** 2;
    let groupSq = 0;
    for (const x of arr) {
      groupSq += (x - mean) ** 2;
    }
    ssWithin += groupSq;
    const variance = n > 1 ? groupSq / (n - 1) : 0;
    return {
      groupName: name,
      count: n,
      mean: Number(mean.toFixed(2)),
      stdDev: Number(Math.sqrt(variance).toFixed(2)),
    };
  });

  const dfBetween = k - 1;
  const dfWithin = totalN - k;
  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;
  const fStatistic = msWithin === 0 ? 0 : Number((msBetween / msWithin).toFixed(4));

  const ssTotal = ssBetween + ssWithin;
  const etaSquared = ssTotal === 0 ? 0 : Number((ssBetween / ssTotal).toFixed(4));
  const cohensF =
    etaSquared >= 1 || etaSquared <= 0
      ? 0
      : Number(Math.sqrt(etaSquared / (1 - etaSquared)).toFixed(4));

  let effectMagnitude: AnovaCohortReport["effectMagnitude"] = "negligible";
  if (cohensF >= 0.4) effectMagnitude = "large";
  else if (cohensF >= 0.25) effectMagnitude = "medium";
  else if (cohensF >= 0.1) effectMagnitude = "small";

  return {
    groupSummaries,
    dfBetween,
    dfWithin,
    ssBetween: Number(ssBetween.toFixed(4)),
    ssWithin: Number(ssWithin.toFixed(4)),
    fStatistic,
    etaSquared,
    cohensF,
    effectMagnitude,
  };
}

/**
 * Computes classical item discrimination index (D = P_upper27% - P_lower27%)
 * and highlights 3-point killer questions across StudentExam records.
 */
export function analyzeQuestionDiscrimination(
  exams: StudentExam[]
): QuestionDiscriminationMetric[] {
  if (exams.length === 0) return [];
  const qCount = exams[0]?.questions.length ?? 0;
  if (qCount === 0) return [];

  const sorted = [...exams].sort((a, b) => b.actualScore - a.actualScore);
  const sliceSize = Math.max(1, Math.round(sorted.length * 0.27));
  const upperGroup = sorted.slice(0, sliceSize);
  const lowerGroup = sorted.slice(sorted.length - sliceSize);
  const threePtSet = new Set(exams[0]?.threePointQuestions ?? []);

  const metrics: QuestionDiscriminationMetric[] = [];
  for (let qIdx = 0; qIdx < qCount; qIdx++) {
    const totalCorrect = exams.filter((e) => e.questions[qIdx]).length;
    const upperCorrect = upperGroup.filter((e) => e.questions[qIdx]).length;
    const lowerCorrect = lowerGroup.filter((e) => e.questions[qIdx]).length;

    const correctRate = Number(((totalCorrect / exams.length) * 100).toFixed(2));
    const upperCohortRate = Number((upperCorrect / upperGroup.length).toFixed(4));
    const lowerCohortRate = Number((lowerCorrect / lowerGroup.length).toFixed(4));
    const discriminationIndex = Number((upperCohortRate - lowerCohortRate).toFixed(4));

    let classification: QuestionDiscriminationMetric["classification"] = "low_discriminator";
    if (discriminationIndex >= 0.4) classification = "high_discriminator";
    else if (discriminationIndex >= 0.2) classification = "moderate_discriminator";

    metrics.push({
      questionNumber: qIdx + 1,
      isThreePoint: threePtSet.has(qIdx),
      correctRate,
      upperCohortRate,
      lowerCohortRate,
      discriminationIndex,
      classification,
    });
  }

  return metrics;
}
