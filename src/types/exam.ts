export interface Academy {
  name: string;
  createdAt: string;
}

export interface StudentExam {
  id: string;
  academyName: string;
  studentName: string;
  grade: string;
  examRound: string;
  actualScore: number;
  questions: boolean[]; // true = correct, false = incorrect
  threePointQuestions: number[]; // indices of 3-point questions
  calculatedScore: number;
  gradeLevel: string;
  createdAt: string;
}

export interface CSVRow {
  학원명: string;
  이름: string;
  학년: string;
  '모의고사 회차': string;
  실제점수: string;
  [key: string]: string; // For question columns
}

export interface DashboardStats {
  totalStudents: number;
  averageScore: number;
  gradeDistribution: {[key: string]: number;};
  questionAnalysis: {questionNumber: number;correctRate: number;}[];
  scoreHistory: {examRound: string;averageScore: number;}[];
}