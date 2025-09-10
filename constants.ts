
import React from 'react';
import { QuestionCategory } from './types';
import { BrainIcon } from './components/icons/BrainIcon';
import { CalculatorIcon } from './components/icons/CalculatorIcon';
import { BookIcon } from './components/icons/BookIcon';
import { BriefcaseIcon } from './components/icons/BriefcaseIcon';

interface CategoryInfo {
  id: QuestionCategory;
  title: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: QuestionCategory.LOGICAL,
    title: 'Logical Reasoning',
    description: 'Assess patterns, sequences, and relationships to test your problem-solving abilities.',
    Icon: BrainIcon,
    color: 'bg-sky-500',
  },
  {
    id: QuestionCategory.NUMERICAL,
    title: 'Numerical Reasoning',
    description: 'Interpret data from charts and tables to solve quantitative business problems.',
    Icon: CalculatorIcon,
    color: 'bg-emerald-500',
  },
  {
    id: QuestionCategory.VERBAL,
    title: 'Verbal Reasoning',
    description: 'Analyze written passages and arguments to evaluate your comprehension skills.',
    Icon: BookIcon,
    color: 'bg-amber-500',
  },
  {
    id: QuestionCategory.CASE_STUDY,
    title: 'Case Study',
    description: 'Tackle mini business scenarios to test your analytical and strategic thinking.',
    Icon: BriefcaseIcon,
    color: 'bg-rose-500',
  },
];
