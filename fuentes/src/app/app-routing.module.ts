import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { LoginComponent } from './modals/login/login.component';
const routes: Routes = [
  { path: '', component: HomeComponent }, // Ruta para Inicio
  { path: 'tasks', component: TaskListComponent }, // Ruta para Productos
  { path: 'users', component: UserListComponent },
  { path: 'login', component: LoginComponent }, // Ruta para Categorías
  { path: '**', redirectTo: '' } // Redirección a Inicio en caso de rutas no encontradas

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
