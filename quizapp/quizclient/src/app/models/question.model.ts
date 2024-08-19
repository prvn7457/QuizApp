import { Answer } from "./answer.model";
import { QuestionOption } from "./QuestionOption.model";

// question.model.ts
export interface Question {
    id: number;
    questionText: string;
    questionType:string;
    options: QuestionOption[];  
    answers: Answer[];
  }