import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Respuesta } from 'src/app/models/respuesta';
import { Login } from '../../models/login';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockLoginService = jasmine.createSpyObj('LoginService', ['doLogin', 'setLoggedIn']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        { provide: Router, useValue: mockRouter },
        FormBuilder
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['nick']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should login successfully and navigate on valid form submission', () => {
    const mockResponse: Respuesta = { result: 'mockToken' };
    mockLoginService.doLogin.and.returnValue(of(mockResponse));
    
    component.loginForm.controls['nick'].setValue('testUser');
    component.loginForm.controls['password'].setValue('testPassword');
    
    component.onSubmit();

    expect(mockLoginService.doLogin).toHaveBeenCalledWith(jasmine.any(Login));
    expect(mockLoginService.setLoggedIn).toHaveBeenCalledWith(true);
    expect(sessionStorage.getItem('authToken')).toBe('mockToken');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should log error on login failure', () => {
    mockLoginService.doLogin.and.returnValue(throwError('Error de autenticación'));

    component.loginForm.controls['nick'].setValue('testUser');
    component.loginForm.controls['password'].setValue('testPassword');

    spyOn(console, 'error');
    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Error de autenticación:', 'Error de autenticación');
  });

  it('should not submit the form if it is invalid', () => {
    component.loginForm.controls['nick'].setValue('');
    component.onSubmit();

    expect(mockLoginService.doLogin).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Formulario inválido");
  });
});