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
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { ApiResponse } from "@nestjs/swagger";
import { TaskDTO } from "./tasks.dto";

@Controller({
  version: "1",
  path: "projects/:projectId/tasks",
})
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  @ApiResponse({})
  findAllByProject(@Param("projectId", ParseUUIDPipe) projectId: string) {
    return this.taskService.findAllByProject(projectId);
  }

  @Get(":taskId")
  @ApiResponse({})
  findById(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Param("projectId", ParseUUIDPipe) projectId: string,
  ) {
    return this.taskService.findById(projectId, taskId);
  }

  @Post()
  @ApiResponse({})
  create(
    @Param("projectId", ParseUUIDPipe) projectId: string,
    @Body() data: TaskDTO,
  ) {
    return this.taskService.create(projectId, data);
  }

  @Put(":taskId")
  @ApiResponse({})
  update(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Param("projectId", ParseUUIDPipe) projectId: string,
    @Body() data: TaskDTO,
  ) {
    return this.taskService.update(projectId, taskId, data);
  }

  @Delete(":taskId")
  @ApiResponse({})
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Param("projectId", ParseUUIDPipe) projectId: string,
  ) {
    return this.taskService.delete(projectId, taskId);
  }
}
