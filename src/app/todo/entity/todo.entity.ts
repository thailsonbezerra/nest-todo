import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'todos' })
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  task: string;

  @Column({ name: 'is_done' })
  @ApiProperty()
  isDone: number;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  @ApiProperty()
  deletedAt: string;

  constructor(todo?: Partial<Todo>) {
    this.id = todo.id;
    this.task = todo.task;
    this.isDone = todo.isDone;
    this.createdAt = todo.createdAt;
    this.updatedAt = todo.updatedAt;
    this.deletedAt = todo.deletedAt;
  }
}
