import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('api/v1/todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async index() {
    return await this.todoService.findAll();
  }

  @Post()
  async create(@Body() body) {
    return await this.todoService.create(body);
  }

  @Get(':id')
  async show(@Param('id', new ParseUUIDPipe()) id) {
    return await this.todoService.findOneOrFail(id);
  }

  @Put(':id')
  async update(@Param('id', new ParseUUIDPipe()) id, @Body() body) {
    return await this.todoService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', new ParseUUIDPipe()) id) {
    await this.todoService.deleteById(id);
  }
}
