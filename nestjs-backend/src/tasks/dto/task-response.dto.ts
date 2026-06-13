/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';

import { TaskPriority } from '../../common/enums/task-priority.enum';
import { TaskStatus } from '../../common/enums/task-status.enum';

export class TaskResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    enum: TaskStatus,
  })
  status!: TaskStatus;

  @ApiProperty({
    enum: TaskPriority,
  })
  priority!: TaskPriority;

  @ApiProperty({
    nullable: true,
  })
  dueDate?: Date | null;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  isConvertedFromNote!: boolean;

  @ApiProperty({
    nullable: true,
  })
  sourceNoteId?: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}