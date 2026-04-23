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
  UseInterceptors,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { ApiResponse } from "@nestjs/swagger";
import { TaskDTO } from "./tasks.dto";
import { ValidateResourcesIdsInterceptor } from "../common/interceptors/validate-resources-ids.interceptor";
import { ValidateResourcesIds } from "../common/decorators/validate-resources-ids.decorator";

@Controller({
  version: "1",
  path: "projects/:projectId/tasks",
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  @ValidateResourcesIds()
  @ApiResponse({})
  findAllByProject(@Param("projectId", ParseUUIDPipe) projectId: string) {
    return this.taskService.findAllByProject(projectId);
  }

  @Get(":taskId")
  @ValidateResourcesIds()
  @ApiResponse({})
  findById(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Param("projectId", ParseUUIDPipe) projectId: string,
  ) {
    return this.taskService.findById(projectId, taskId);
  }

  @Post()
  @ValidateResourcesIds()
  @ApiResponse({})
  create(
    @Param("projectId", ParseUUIDPipe) projectId: string,
    @Body() data: TaskDTO,
  ) {
    return this.taskService.create(projectId, data);
  }

  @Put(":taskId")
  @ValidateResourcesIds()
  @ApiResponse({})
  update(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Param("projectId", ParseUUIDPipe) projectId: string,
    @Body() data: TaskDTO,
  ) {
    return this.taskService.update(projectId, taskId, data);
  }

  @Delete(":taskId")
  @ValidateResourcesIds()
  @ApiResponse({})
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Param("projectId", ParseUUIDPipe) projectId: string,
  ) {
    return this.taskService.delete(projectId, taskId);
  }
}
