import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Question } from './models/question.model';
import { Answer } from './models/answer.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'https://localhost:7040/api';

  constructor(private http: HttpClient) { }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/Questions`);
  }

  validateAnswers(answers: Answer[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/Answers`, answers);
  }
}