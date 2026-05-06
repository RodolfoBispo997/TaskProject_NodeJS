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
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiResponse,
} from "@nestjs/swagger";
import { TaskFullDTO, TaskListItemDTO, TaskRequestDTO } from "./tasks.dto";
import { ValidateResourcesIdsInterceptor } from "../../common/interceptors/validate-resources-ids.interceptor";
import { ValidateResourcesIds } from "../../common/decorators/validate-resources-ids.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth/jwt-auth.guard";
import { ApiPaginatedResponse } from "../../common/swagger/api-paginated-response";
import { QueryPaginationDTO } from "../../common/dtos/query-pagination.dto";

@Controller({
  version: "1",
  path: "projects/:projectId/tasks",
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("jwt")
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  @ValidateResourcesIds()
  @ApiPaginatedResponse(TaskListItemDTO)
  findAllByProject(
    @Param("projectId", ParseUUIDPipe) projectId: string,
    @Query() query?: QueryPaginationDTO,
  ) {
    return this.taskService.findAllByProject(projectId, query);
  }

  @Get(":taskId")
  @ValidateResourcesIds()
  @ApiOkResponse({
    type: TaskFullDTO,
  })
  findById(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Param("projectId", ParseUUIDPipe) projectId: string,
  ) {
    return this.taskService.findById(projectId, taskId);
  }

  @Post()
  @ValidateResourcesIds()
  @ApiCreatedResponse({
    type: TaskListItemDTO,
  })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param("projectId", ParseUUIDPipe) projectId: string,
    @Body() data: TaskRequestDTO,
  ) {
    return this.taskService.create(projectId, data);
  }

  @Put(":taskId")
  @ValidateResourcesIds()
  @ApiOkResponse({
    type: TaskListItemDTO,
  })
  @HttpCode(HttpStatus.OK)
  update(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Param("projectId", ParseUUIDPipe) projectId: string,
    @Body() data: TaskRequestDTO,
  ) {
    return this.taskService.update(projectId, taskId, data);
  }

  @Delete(":taskId")
  @ValidateResourcesIds()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: "Task deleted successfully" })
  delete(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Param("projectId", ParseUUIDPipe) projectId: string,
  ) {
    return this.taskService.delete(projectId, taskId);
  }
}
