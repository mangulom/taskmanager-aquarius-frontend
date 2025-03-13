import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskService } from './../../../services/task.service';
import { Task } from '../../../models/task';
import { Respuesta } from '../../../models/respuesta';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalTaskComponent } from 'src/app/modals/modal-task/modal-task.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  productForm: FormGroup;
  tasks: Task[] = new Array<Task>();
  displayedColumns: string[] = ['title', 'status', 'actions'];
  loading: boolean = false;
  constructor(private taskService: TaskService, private fb: FormBuilder, private dialog: MatDialog) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]], // Validación para el nombre
      description: [''],
      status: ['NO COIMPLETADA', Validators.required]
    });
  }

  ngOnInit(): void {
    this.tasks = new Array<Task>();
    this.getTasks();
  }

  getTasks() {
    this.loading = true;
    this.taskService.getTasks().subscribe(
      (respuesta: Respuesta) => {
        this.tasks = respuesta.result;
      },
      (error) => {
        Swal.fire('Alerta', 'Error obteniendo ista de tareas', 'error');
      }
    )
    this.loading = false;
  }

  updateTask(task: Task): void {
    this.openModal(task);
  }

  deleteTask(taskId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.loading = true;
      this.taskService.deleteTask(taskId).subscribe(
        () => {
          Swal.fire('Alerta', 'Tarea eliminada satisfactoriamente', 'success');
          this.getTasks();
        },
        (error) => {
          Swal.fire('Alerta', 'No se pudo obtener la lista de tareas', 'error');
        }
      );
      this.loading = false;
    }
  }

  getStatusColor(status: boolean): string {
    switch (status) {
      case false:
        return 'warn';
      case true:
        return 'info';
      default:
        return 'danger';
    }
  }

  getStatusIcon(status: boolean): string {
    switch (status) {
      case false:
        return 'pending';
      case true:
        return 'check_circle';
      default:
        return 'help';
    }
  }

  openModal(task: Task | null): void {
    if (!sessionStorage.getItem("authToken")) {
      Swal.fire('Alerta', 'No ha iniciado sessión', 'error');
    } else {
      var titulo = task == null ? "Agregar Tarea" : "Editar Tarea";
      const dialogRef = this.dialog.open(ModalTaskComponent, {
        width: '650px',
        height: '485px',
        panelClass: 'custom-modal',
        data: {
          task,
          title: titulo
        }
      });
      dialogRef.componentInstance.taskAdded.subscribe(
        () => {
          this.getTasks();
        }
      )
    }
  }
}