import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './side-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { of } from 'rxjs';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockLoginService = jasmine.createSpyObj('LoginService', ['setLoggedIn'], { loggedIn$: of(false) });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ SidebarComponent ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: Router, useValue: mockRouter },
        { provide: LoginService, useValue: mockLoginService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar', () => {
    expect(component.isSidebarOpened).toBeTrue();
    component.toggleSidebar();
    expect(component.isSidebarOpened).toBeFalse();
  });

  it('should navigate to login when login() is called', () => {
    component.login();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should logout and navigate to home when logout() is called', () => {
    component.logout();
    expect(mockLoginService.setLoggedIn).toHaveBeenCalledWith(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
    expect(sessionStorage.getItem('authToken')).toBeNull();
  });

  it('should toggle login state with toggleLogin()', () => {
    component.isLoggedIn = false;
    component.toggleLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);

    component.isLoggedIn = true;
    component.toggleLogin();
    expect(mockLoginService.setLoggedIn).toHaveBeenCalledWith(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should set isLoggedIn based on loginService', () => {
    mockLoginService.loggedIn$ = of(true);
    component.ngOnInit();
    expect(component.isLoggedIn).toBeTrue();
  });
});