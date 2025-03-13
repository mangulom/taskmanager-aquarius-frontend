import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from './../../../services/task.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Respuesta } from '../../../models/respuesta';
import { Task } from '../../../models/task';
import { ModalTaskComponent } from 'src/app/modals/modal-task/modal-task.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', ['getTasks', 'deleteTask']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ TaskListComponent ],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: MatDialog, useValue: mockDialog },
        FormBuilder
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tasks on ngOnInit', () => {
    const mockResponse: Respuesta = { result: [{ title: 'Test Task', status: 'POR HACER' }] };
    mockTaskService.getTasks.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(component.tasks).toEqual(mockResponse.result);
    expect(mockTaskService.getTasks).toHaveBeenCalled();
  });

  it('should open modal with correct data when updating a task', () => {
    const task: Task = { title: 'Test Task', description: 'Test Description', status: 'POR HACER' };
    component.updateTask(task);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockDialog.open).toHaveBeenCalledWith(ModalTaskComponent, {
      width: '650px',
      height: '485px',
      panelClass: 'custom-modal',
      data: { task, title: 'Editar Tarea' }
    });
  });

  it('should delete task and refresh tasks', () => {
    const taskId = 'test-id';
    spyOn(window, 'confirm').and.returnValue(true);
    mockTaskService.deleteTask.and.returnValue(of(void 0));

    component.deleteTask(taskId);

    expect(mockTaskService.deleteTask).toHaveBeenCalledWith(taskId);
    expect(mockTaskService.getTasks).toHaveBeenCalled();
  });

  it('should not delete task if user cancels', () => {
    const taskId = 'test-id';
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteTask(taskId);

    expect(mockTaskService.deleteTask).not.toHaveBeenCalled();
  });

  it('should return correct status color', () => {
    expect(component.getStatusColor('POR HACER')).toBe('warn');
    expect(component.getStatusColor('EN PROGRESO')).toBe('info');
    expect(component.getStatusColor('COMPLETADA')).toBe('primary');
    expect(component.getStatusColor('UNKNOWN')).toBe('');
  });

  it('should return correct status icon', () => {
    expect(component.getStatusIcon('POR HACER')).toBe('pending');
    expect(component.getStatusIcon('EN PROGRESO')).toBe('hourglass_empty');
    expect(component.getStatusIcon('COMPLETADA')).toBe('check_circle');
    expect(component.getStatusIcon('UNKNOWN')).toBe('help');
  });

  it('should open modal for adding a task', () => {
    component.openModal(null);
    expect(mockDialog.open).toHaveBeenCalledWith(ModalTaskComponent, {
      width: '650px',
      height: '485px',
      panelClass: 'custom-modal',
      data: { task: null, title: 'Agregar Tarea' }
    });
  });
});