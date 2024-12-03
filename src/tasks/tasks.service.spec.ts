import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  createTask: jest.fn(),
  getTaskById: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = () => ({
  username: 'Test user',
  password: 'test password',
  id: '1',
  tasks: [],
});

const mockTasks = [
  {
    id: '1',
    title: 'Test task1',
    description: 'Test description1',
    status: TaskStatus.OPEN,
    user: mockUser(),
  },
  {
    id: '2',
    title: 'Test task2',
    description: 'Test description2',
    status: TaskStatus.IN_PROGRESS,
    user: mockUser(),
  },
];

describe('TasksService', () => {
  let taskService: TasksService;
  let taskRepository: jest.Mocked<TaskRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    taskService = module.get(TasksService);
    taskRepository = module.get(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue(mockTasks);
      const result = await taskService.getTasks(null, mockUser());
      expect(result).toBe(mockTasks);
    });
  });
  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and returns the result', async () => {
      taskRepository.findOne.mockResolvedValue(mockTasks[0]);
      const result = await taskService.getTaskById('1', mockUser());
      expect(result).toEqual(mockTasks[0]);
    });

    it('calls taskRepository.findOne() and returns error', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(taskService.getTaskById('123', mockUser())).rejects.toThrow(
        NotFoundException,
      );
    });
  });d
});
