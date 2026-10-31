import assert from "node:assert/strict";
import { test } from "node:test";
import type { StudentExam } from "../types/exam.ts";
import {
  analyzeQuestionDiscrimination,
  computeOneWayAnova,
} from "./anova-cohort-stats.ts";

test("computeOneWayAnova calculates F-statistic, eta-squared, and G*Power Cohen's f across classes", () => {
  const report = computeOneWayAnova({
    "달빛A반 (심화)": [92, 95, 89, 94, 91],
    "달빛B반 (표준)": [78, 82, 75, 80, 79],
    "달빛C반 (기초)": [64, 68, 61, 66, 65],
  });

  assert.equal(report.dfBetween, 2);
  assert.equal(report.dfWithin, 12);
  assert.ok(report.fStatistic > 50);
  assert.ok(report.etaSquared > 0.85);
  assert.ok(report.cohensF > 0.4);
  assert.equal(report.effectMagnitude, "large");
});

test("analyzeQuestionDiscrimination identifies 3-point killer questions with high discrimination index D", () => {
  const makeStudent = (
    id: string,
    score: number,
    q1: boolean,
    q2Killer: boolean
  ): StudentExam => ({
    id,
    academyName: "달빛영어학원",
    studentName: id,
    grade: "고2",
    examRound: "2026년 10월 모의고사",
    actualScore: score,
    questions: [q1, q2Killer],
    threePointQuestions: [1],
    calculatedScore: score,
    gradeLevel: score >= 90 ? "1" : "3",
    createdAt: "2026-10-31",
  });

  const exams: StudentExam[] = [
    makeStudent("s1", 96, true, true),
    makeStudent("s2", 93, true, true),
    makeStudent("s3", 84, true, false),
    makeStudent("s4", 79, true, false),
    makeStudent("s5", 68, true, false),
    makeStudent("s6", 62, true, false),
  ];

  const metrics = analyzeQuestionDiscrimination(exams);
  assert.equal(metrics.length, 2);
  assert.equal(metrics[0]?.discriminationIndex, 0);
  assert.equal(metrics[1]?.isThreePoint, true);
  assert.equal(metrics[1]?.discriminationIndex, 1);
  assert.equal(metrics[1]?.classification, "high_discriminator");
});
