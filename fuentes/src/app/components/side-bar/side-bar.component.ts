import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private dialog: MatDialog, private router: Router, private loginService: LoginService) { }
  isSidebarOpened = true;
  isLoggedIn = false;
  menuItems = [
    { name: 'Inicio', icon: 'home', route: '/' },
    { name: 'Tareas', icon: 'shopping_cart', route: '/tasks' }
  ];

  ngOnInit(): void {
    this.loginService.loggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  toggleSidebar() {
    this.isSidebarOpened = ! this.isSidebarOpened;
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.loginService.setLoggedIn(false);
    this.isLoggedIn = false;
    sessionStorage.removeItem('authToken');
    this.router.navigate(['']);
  }

  toggleLogin() {
    if (this.isLoggedIn) {
      this.logout();
    } else {
      this.login();
    }
  }
}
