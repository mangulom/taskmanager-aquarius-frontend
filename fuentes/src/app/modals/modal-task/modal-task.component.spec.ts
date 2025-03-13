import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalTaskComponent } from './modal-task.component';
import { FormBuilder } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/task';
import { By } from '@angular/platform-browser';

describe('ModalTaskComponent', () => {
  let component: ModalTaskComponent;
  let fixture: ComponentFixture<ModalTaskComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ModalTaskComponent>>;
  const mockData = { task: null, title: 'Agregar Tarea' };

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', ['createTask']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ ModalTaskComponent ],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        FormBuilder
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.taskForm).toBeDefined();
    expect(component.taskForm.controls['title']).toBeDefined();
    expect(component.taskForm.controls['description']).toBeDefined();
    expect(component.taskForm.controls['status']).toBeDefined();
  });

  it('should emit taskAdded event on valid form submission', () => {
    const mockResponse = new Task();
    mockResponse.title = 'Test Task';

    mockTaskService.createTask.and.returnValue(of(mockResponse));

    component.taskForm.controls['title'].setValue('Test Task');
    component.taskForm.controls['description'].setValue('Test Description');
    component.taskForm.controls['status'].setValue('POR HACER');

    spyOn(component.taskAdded, 'emit');

    component.onSubmit();

    expect(mockTaskService.createTask).toHaveBeenCalledWith(component.task);
    expect(component.taskAdded.emit).toHaveBeenCalledWith(mockResponse);
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should log error on task creation failure', () => {
    mockTaskService.createTask.and.returnValue(throwError('Error al guardar la tarea'));

    spyOn(console, 'error');

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith("Error al guardar la tarea:", 'Error al guardar la tarea');
  });

  it('should not submit the form if it is invalid', () => {
    spyOn(console, 'log');
    component.taskForm.controls['title'].setValue('');

    component.onSubmit();

    expect(mockTaskService.createTask).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Formulario inválido");
  });

  it('should close the modal', () => {
    component.closeModal();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});