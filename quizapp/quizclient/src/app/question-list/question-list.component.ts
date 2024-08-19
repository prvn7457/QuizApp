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
    this.questionService.validateAnswers(submittedAnswers).subscribe(result => {
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
    if (this.questions && this.questions.length) {
        this.questions.forEach((question) => {
            if (question.questionType === 'Multiselect') {
                const checkboxes = document.querySelectorAll(`input[type='checkbox'][name='question${question.id}']:checked`);
                checkboxes.forEach((checkbox) => {
                    const inputElement = checkbox as HTMLInputElement; // Type assertion
                    selectedAnswers.push({
                        AwnserId: 0, // placeholder or null
                        QuestionId: question.id,
                        OptionId: +inputElement.value
                    });
                });
            } else if (question.questionType === 'Radio' || question.questionType === 'boolean') {
                const radio = document.querySelector(`input[type='radio'][name='question${question.id}']:checked`) as HTMLInputElement;
                if (radio) {
                    selectedAnswers.push({
                        AwnserId: 0, 
                        QuestionId: question.id,
                        OptionId: +radio.value
                    });
                }
            } else  if (question.questionType === 'Dropdown') {
              const select = document.querySelector(`select[name='question${question.id}']`) as HTMLSelectElement;
              if (select && select.value && select.value !== '') {
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



}
