import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { Todo } from './entity/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

const todoList: Todo[] = [
  new Todo({ id: '1', task: 'task-1', isDone: 0 }),
  new Todo({ id: '2', task: 'task-2', isDone: 0 }),
  new Todo({ id: '3', task: 'task-3', isDone: 0 }),
];

const newTodo = new Todo({ task: 'new-task', isDone: 0 });

const updateTodo = new Todo({ task: 'task-1', isDone: 1 });

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(todoList),
            create: jest.fn().mockResolvedValue(newTodo),
            findOneOrFail: jest.fn().mockResolvedValue(todoList[0]),
            update: jest.fn().mockResolvedValue(updateTodo),
            deleteById: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('index', () => {
    it('should return a todo list entity successfully', async () => {
      const result = await todoController.index();

      expect(result).toEqual(todoList);
    });

    it('should throw an exception', () => {
      jest.spyOn(todoService, 'findAll').mockRejectedValueOnce(new Error());

      expect(todoController.index()).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create a new todo item successfully', async () => {
      const body: CreateTodoDto = {
        task: 'new-task',
        isDone: 0,
      };

      const result = await todoController.create(body);

      expect(result).toEqual(newTodo);
      expect(todoService.create).toHaveBeenCalledTimes(1);
      expect(todoService.create).toHaveBeenCalledWith(body);
    });

    it('should throw an exception', () => {
      const body: CreateTodoDto = {
        task: 'new-task',
        isDone: 0,
      };

      jest.spyOn(todoService, 'create').mockRejectedValueOnce(new Error());

      expect(todoController.create(body)).rejects.toThrowError();
    });
  });

  describe('show', () => {
    it('should get a todo item successfully', async () => {
      const result = await todoController.show('1');

      expect(result).toEqual(todoList[0]);
      expect(todoService.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(todoService.findOneOrFail).toHaveBeenCalledWith('1');
    });

    it('should throw an exception', () => {
      jest
        .spyOn(todoService, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      expect(todoController.show('1')).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a todo item successfully', async () => {
      const body: UpdateTodoDto = {
        task: 'task-1',
        isDone: 1,
      };
      const result = await todoController.update('1', body);

      expect(result).toEqual(updateTodo);
      expect(todoService.update).toHaveBeenCalledTimes(1);
      expect(todoService.update).toHaveBeenCalledWith('1', body);
    });

    it('should throw an exception', () => {
      const body: UpdateTodoDto = {
        task: 'task-1',
        isDone: 1,
      };

      jest.spyOn(todoService, 'update').mockRejectedValueOnce(new Error());

      expect(todoController.update('1', body)).rejects.toThrowError();
    });
  });

  describe('destroy', () => {
    it('should remove a todo item successfully', async () => {
      const result = await todoController.destroy('1');

      expect(result).toBeUndefined();
    });

    it('should throw an exception', () => {
      jest.spyOn(todoService, 'deleteById').mockRejectedValueOnce(new Error());

      expect(todoController.destroy('1')).rejects.toThrowError();
    });
  });
});
