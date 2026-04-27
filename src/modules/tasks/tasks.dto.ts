import { ApiProperty } from "@nestjs/swagger";
import { TaskPriority, TaskStatus } from "../../generated/prisma";
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class TaskDTOList {
  @ApiProperty({ description: "Task title" })
  @IsString()
  @IsNotEmpty()
  title!: string;
  @ApiProperty({ description: "Task description", required: false })
  @IsString()
  description!: string;
  @ApiProperty({
    description: "Task status",
    enum: TaskStatus,
    default: TaskStatus.TODO,
    required: false,
  })
  @IsString()
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.TODO;
  @ApiProperty({
    description: "Task priority",
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
    required: false,
  })
  @IsString()
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.MEDIUM;
  @ApiProperty({
    description: "Task dueDate",
    required: false,
  })
  @IsString()
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
