import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { Login } from '../models/login';
import { Respuesta } from '../models/respuesta';
import { environment } from 'src/environments/environment';

describe('LoginService', () => {
  let service: LoginService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });

    service = TestBed.inject(LoginService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set logged in status correctly', () => {
    service.setLoggedIn(true);
    expect(service.isLoggedIn()).toBeTrue();

    service.setLoggedIn(false);
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should perform login and return expected response', () => {
    const loginData: Login = { nick: 'testUser', password: 'testPassword' };
    const mockResponse: Respuesta = { result: 'mockToken' };

    service.doLogin(loginData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiEndpointAuth}/login`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  });

  it('should handle error during login', () => {
    const loginData: Login = { nick: 'testUser', password: 'testPassword' };

    service.doLogin(loginData).subscribe(
      () => fail('should have failed with a 500 status'),
      (error) => {
        expect(error.status).toEqual(500);
      }
    );

    const req = httpTestingController.expectOne(`${environment.apiEndpointAuth}/login`);
    req.flush('Login failed', { status: 500, statusText: 'Server Error' });
  });
});