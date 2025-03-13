import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task'
import { environment } from 'src/environments/environment';
import { Respuesta } from '../models/respuesta';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem("authToken") ?? ''}`,
      'Content-Type': 'application/json'
    });
  }

  getTasks(): Observable<Respuesta> {
    return this.http.get<Respuesta>(this.apiUrl, { headers: this.getHeaders() });
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, { headers: this.getHeaders()});
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task, { headers: this.getHeaders()});
  }

  deleteTask(id: string): Observable<void> {

    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, { headers: this.getHeaders() });
  }
} 