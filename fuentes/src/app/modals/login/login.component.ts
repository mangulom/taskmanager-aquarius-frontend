import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from '../../models/login';
import { LoginService } from 'src/app/services/login.service';
import { Respuesta } from 'src/app/models/respuesta';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  login: Login = new Login();


  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.login = new Login();
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      nick: ['', [Validators.required, Validators.minLength(3)]],
      password: ['']
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.login = new Login();
      this.login.nick = this.loginForm.value.nick;
      this.login.password = this.loginForm.value.password;

      this.loginService.doLogin(this.login).subscribe(
        (response: Respuesta) => {
          if(response.result==null) {
            Swal.fire(response.message, 'error');
            this.router.navigate(['/login']);
          } else {
            sessionStorage.setItem('authToken', response.result);
            this.loginService.setLoggedIn(true);
            Swal.fire('Bienvenido', 'Inicio de sesión exitoso', 'success');
            this.router.navigate(['/tasks']);
          }
        },
        (error) => {
          Swal.fire('Alerta', 'Credenciales inválidas', 'error');
          this.router.navigate(['/login']);
        }
      );
    } else {
      Swal.fire('Alerta', 'Formulario inválido', 'error');
      this.router.navigate(['/login']);
    }
  }

}

