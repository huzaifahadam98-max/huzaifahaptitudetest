
export enum QuestionCategory {
  LOGICAL = 'Logical Reasoning',
  NUMERICAL = 'Numerical Reasoning',
  VERBAL = 'Verbal Reasoning',
  CASE_STUDY = 'Case Study',
}

export interface ChartData {
  type: 'bar' | 'pie' | 'line';
  data: { name: string; value: number }[];
  dataKey?: string;
}

export interface AptitudeQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  questionType: QuestionCategory;
  chartData?: ChartData;
}
