import { Component, OnInit } from '@angular/core';
import { Question } from '../models/question.model';
import { QuestionService } from '../question.service';
import { Answer } from '../models/answer.model';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {
  showResults: boolean = false;
  totalQuestions: number = 0;
  correctQuestions: number = 0;
  actualMarks: number = 0;
  percentage: number = 0;
  questions: Question[] = [];

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.questionService.getQuestions().subscribe(data => {
      console.log(data);
      this.questions = data;
      this.totalQuestions = data.length;
    });
  }

  onSubmit() {
    const submittedAnswers: Answer[] = this.getSelectedAnswers();
    
    // Group the answers by QuestionId for Multiselect questions
    const groupedAnswers = this.groupAnswersByQuestionId(submittedAnswers);

    this.questionService.validateAnswers(groupedAnswers).subscribe(result => {
      console.log(result);
      this.correctQuestions = result.correctAnswersCount;
      this.actualMarks = result.score;
      this.percentage = (this.actualMarks / 20) * 100;
      this.showResults=true;

      //alert('Your score: ' + result.score);

    });
  }

  getSelectedAnswers(): Answer[] {
    const selectedAnswers: Answer[] = [];
    const uniqueQuestionIds = new Set<number>();

    if (this.questions && this.questions.length) {
        this.questions.forEach((question) => {
            if (question.questionType === 'Multiselect') {
                const checkboxes = document.querySelectorAll(`input[type='checkbox'][name='question${question.id}']:checked`);

                if (checkboxes.length > 0) {
                    // Only add one entry for the multiselect question
                    uniqueQuestionIds.add(question.id);
                    const firstSelectedCheckbox = checkboxes[0] as HTMLInputElement; // Cast to HTMLInputElement
                    selectedAnswers.push({
                        AwnserId: 0, // placeholder or null
                        QuestionId: question.id,
                        OptionId: +firstSelectedCheckbox.value // Use the value of the first selected option
                    });
                }

            } else if (question.questionType === 'Radio' || question.questionType === 'boolean') {
                const radio = document.querySelector(`input[type='radio'][name='question${question.id}']:checked`) as HTMLInputElement;
                if (radio) {
                    uniqueQuestionIds.add(question.id);
                    selectedAnswers.push({
                        AwnserId: 0, 
                        QuestionId: question.id,
                        OptionId: +radio.value
                    });
                }
            } else if (question.questionType === 'Dropdown') {
                const select = document.querySelector(`select[name='question${question.id}']`) as HTMLSelectElement;
                if (select && select.value && select.value !== '') {
                    uniqueQuestionIds.add(question.id);
                    selectedAnswers.push({
                        AwnserId: 0, 
                        QuestionId: question.id,
                        OptionId: +select.value
                    });
                } 
            }
        });
    }

    return selectedAnswers;
}


// Group answers by QuestionId to ensure that multiselect questions are handled as a group
groupAnswersByQuestionId(submittedAnswers: Answer[]): Answer[] {
  const groupedAnswers = new Map<number, Answer>();

  submittedAnswers.forEach(answer => {
      if (!groupedAnswers.has(answer.QuestionId)) {
          groupedAnswers.set(answer.QuestionId, answer);
      } else {
          // If a multiselect question already has an answer stored, we don't add more
          if (this.isMultiselectQuestion(answer.QuestionId)) {
              // Only one entry per multiselect question to ensure the score is calculated correctly
              return;
          }
      }
  });

  // Convert the Map back to an array
  return Array.from(groupedAnswers.values());
}

isMultiselectQuestion(questionId: number): boolean {
  const question = this.questions.find(q => q.id === questionId);
  return question ? question.questionType === 'Multiselect' : false;
}



}
