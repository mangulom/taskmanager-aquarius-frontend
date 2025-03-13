import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task';
import { Respuesta } from '../models/respuesta';
import { environment } from 'src/environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });

    service = TestBed.inject(TaskService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get tasks', () => {
    const mockResponse: Respuesta = { result: [{ id: '1', title: 'Test Task', status: 'POR HACER' }] };

    service.getTasks().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiEndpoint}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  it('should create a new task', () => {
    const newTask: Task = { id: '2', title: 'New Task', description: 'Task description', status: 'POR HACER' };
    service.createTask(newTask).subscribe(response => {
      expect(response).toEqual(newTask);
    });

    const req = httpTestingController.expectOne(`${environment.apiEndpoint}`);
    expect(req.request.method).toEqual('POST');
    req.flush(newTask);
  });

  it('should update an existing task', () => {
    const updatedTask: Task = { id: '1', title: 'Updated Task', description: 'Updated description', status: 'EN PROGRESO' };

    service.updateTask(updatedTask).subscribe(response => {
      expect(response).toEqual(updatedTask);
    });

    const req = httpTestingController.expectOne(`${environment.apiEndpoint}/1`);
    expect(req.request.method).toEqual('PUT');
    req.flush(updatedTask);
  });

  it('should delete a task', () => {
    const taskId = '1';
    service.deleteTask(taskId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpTestingController.expectOne(`${environment.apiEndpoint}/${taskId}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });
});