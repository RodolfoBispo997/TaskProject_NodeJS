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
import { ValidateResourcesIdsInterceptor } from "../../common/interceptors/validate-resources-ids.interceptor";
import { CommentsService } from "./comments.service";
import { ValidateResourcesIds } from "../../common/decorators/validate-resources-ids.decorator";
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiResponse,
} from "@nestjs/swagger";
import {
  CommentFullDTO,
  CommentListItemDTO,
  CommentRequestDTO,
} from "./comments.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth/jwt-auth.guard";

@Controller({
  version: "1",
  path: "projects/:projectId/tasks/:taskId/comments",
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  @ValidateResourcesIds()
  @ApiOkResponse({
    type: [CommentListItemDTO],
    description: "Get all comments by task",
  })
  findAllByTask(@Param("taskId", ParseUUIDPipe) taskId: string) {
    return this.commentService.findAllByTasks(taskId);
  }

  @Get(":commentId")
  @ValidateResourcesIds()
  @ApiOkResponse({
    type: [CommentFullDTO],
    description: "Get comment by ID",
  })
  findById(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Param("commentId", ParseUUIDPipe) commentId: string,
  ) {
    return this.commentService.findById(taskId, commentId);
  }

  @Post()
  @ValidateResourcesIds()
  @ApiCreatedResponse({
    type: [CommentListItemDTO],
    description: "Create a new comment",
  })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Body() data: CommentRequestDTO,
  ) {
    return this.commentService.create(taskId, data);
  }

  @Put(":commentId")
  @ValidateResourcesIds()
  @ApiOkResponse({
    type: [CommentListItemDTO],
    description: "Update a comment",
  })
  @HttpCode(HttpStatus.OK)
  update(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Param("commentId", ParseUUIDPipe) commentId: string,
    @Body() data: CommentRequestDTO,
  ) {
    return this.commentService.update(taskId, commentId, data);
  }

  @Delete(":commentId")
  @ValidateResourcesIds()
  @ApiNoContentResponse({ description: "Delete a comment" })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Param("commentId", ParseUUIDPipe) commentId: string,
  ) {
    return this.commentService.remove(taskId, commentId);
  }
}
