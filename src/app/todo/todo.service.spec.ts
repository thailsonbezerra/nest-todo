import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './entity/todo.entity';
import { Repository } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';

const todoList: Todo[] = [
  new Todo({ id: '1', task: 'task-1', isDone: 0 }),
  new Todo({ id: '2', task: 'task-2', isDone: 0 }),
  new Todo({ id: '3', task: 'task-3', isDone: 0 }),
];

const updateTodoItem = new Todo({ task: 'task-1', isDone: 1 });

describe('TodoService', () => {
  let todoService: TodoService;
  let todoRepository: Repository<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            find: jest.fn().mockResolvedValue(todoList),
            findOneOrFail: jest.fn().mockResolvedValue(todoList[0]),
            create: jest.fn().mockResolvedValue(todoList[0]),
            merge: jest.fn().mockResolvedValue(updateTodoItem),
            save: jest.fn().mockResolvedValue(todoList[0]),
            softDelete: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
    expect(todoRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a todo entity list seccessfully', async () => {
      const result = await todoService.findAll();

      expect(result).toEqual(todoList);
      expect(todoRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest.spyOn(todoRepository, 'find').mockRejectedValueOnce(new Error());

      expect(todoService.findAll()).rejects.toThrowError();
    });
  });

  describe('findOneOrFail', () => {
    it('should return a todo entity item seccessfully', async () => {
      const result = await todoService.findOneOrFail('1');

      expect(result).toEqual(todoList[0]);
      expect(todoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('should throw a not found exception', () => {
      jest
        .spyOn(todoRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      expect(todoService.findOneOrFail('1')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new todo entity item seccessfully', async () => {
      const data: CreateTodoDto = { task: 'task-1', isDone: 0 };

      const result = await todoService.create(data);

      expect(result).toEqual(todoList[0]);
      expect(todoRepository.create).toHaveBeenCalledTimes(1);
      expect(todoRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      const data: CreateTodoDto = { task: 'task-1', isDone: 0 };

      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());

      expect(todoService.create(data)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a todo entity item seccessfully', async () => {
      const data: CreateTodoDto = { task: 'task-1', isDone: 1 };

      jest.spyOn(todoRepository, 'save').mockResolvedValueOnce(updateTodoItem);

      const result = await todoService.update('1', data);

      expect(result).toEqual(updateTodoItem);
    });

    it('should throw a not found exception', () => {
      const data: CreateTodoDto = { task: 'task-1', isDone: 1 };

      jest
        .spyOn(todoRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      expect(todoService.update('1', data)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw an exception', () => {
      const data: CreateTodoDto = { task: 'task-1', isDone: 1 };

      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());

      expect(todoService.update('1', data)).rejects.toThrowError();
    });
  });

  describe('deleteById', () => {
    it('should delete a todo entity item seccessfully', async () => {
      const result = await todoService.deleteById('1');

      expect(result).toBeUndefined();
      expect(todoRepository.softDelete).toHaveBeenCalledTimes(1);
      expect(todoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('should throw a not found exception', () => {
      jest
        .spyOn(todoRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      expect(todoService.deleteById('1')).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw an exception', () => {
      jest
        .spyOn(todoRepository, 'softDelete')
        .mockRejectedValueOnce(new Error());

      expect(todoService.deleteById('1')).rejects.toThrowError();
    });
  });
});
