import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Login } from '../models/login';
import { Respuesta } from '../models/respuesta';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiEndpointAuth;
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  setLoggedIn(status: boolean) {
    this.loggedInSubject.next(status);
  }

  isLoggedIn() {
    return this.loggedInSubject.value;
  }

  doLogin(login: Login) {
    return this.http.post<Respuesta>(this.apiUrl + "/login", login);
  }
}
