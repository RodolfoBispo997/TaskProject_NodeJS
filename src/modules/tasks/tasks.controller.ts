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
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { ApiResponse } from "@nestjs/swagger";
import { TaskDTOList } from "./tasks.dto";
import { ValidateResourcesIdsInterceptor } from "../../common/interceptors/validate-resources-ids.interceptor";
import { ValidateResourcesIds } from "../../common/decorators/validate-resources-ids.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth/jwt-auth.guard";

@Controller({
  version: "1",
  path: "projects/:projectId/tasks",
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  @ValidateResourcesIds()
  @ApiResponse({
    type: [TaskDTOList],
  })
  findAllByProject(@Param("projectId", ParseUUIDPipe) projectId: string) {
    return this.taskService.findAllByProject(projectId);
  }

  @Get(":taskId")
  @ValidateResourcesIds()
  @ApiResponse({
    type: TaskDTOList,
  })
  findById(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Param("projectId", ParseUUIDPipe) projectId: string,
  ) {
    return this.taskService.findById(projectId, taskId);
  }

  @Post()
  @ValidateResourcesIds()
  @ApiResponse({
    type: TaskDTOList,
  })
  create(
    @Param("projectId", ParseUUIDPipe) projectId: string,
    @Body() data: TaskDTOList,
  ) {
    return this.taskService.create(projectId, data);
  }

  @Put(":taskId")
  @ValidateResourcesIds()
  @ApiResponse({
    type: TaskDTOList,
  })
  update(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Param("projectId", ParseUUIDPipe) projectId: string,
    @Body() data: TaskDTOList,
  ) {
    return this.taskService.update(projectId, taskId, data);
  }

  @Delete(":taskId")
  @ValidateResourcesIds()
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Param("projectId", ParseUUIDPipe) projectId: string,
  ) {
    return this.taskService.delete(projectId, taskId);
  }
}
