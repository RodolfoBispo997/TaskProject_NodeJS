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
import { ValidateResourcesIds } from "../../common/decorators/validate-resources-ids.decorator";
import { ValidateResourcesIdsInterceptor } from "../../common/interceptors/validate-resources-ids.interceptor";
import {
  AddCollaboratorsDTO,
  CollaboratorListItemDTO,
  UpdateCollaboratorDTO,
} from "./collaborators.dto";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
} from "@nestjs/swagger";
import { CollaboratorsService } from "./collaborators.service";

@Controller({
  version: "1",
  path: "projects/:projectId/collaborators",
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
export class CollaboratorsController {
  constructor(private readonly collaboratorService: CollaboratorsService) {}

  @Get()
  @ValidateResourcesIds()
  @ApiResponse({ type: [CollaboratorListItemDTO] })
  findAllByProject(@Param("projectId", ParseUUIDPipe) projectId: string) {
    return this.collaboratorService.findAllByProject(projectId);
  }

  @Post()
  @ValidateResourcesIds()
  @ApiCreatedResponse({ type: CollaboratorListItemDTO })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param("projectId", ParseUUIDPipe) projectId: string,
    @Body() data: AddCollaboratorsDTO,
  ) {
    return this.collaboratorService.create(projectId, data);
  }

  @Put(":userId")
  @ValidateResourcesIds()
  @ApiOkResponse({
    type: CollaboratorListItemDTO,
  })
  update(
    @Param("projectId", ParseUUIDPipe) projectId: string,
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body() data: UpdateCollaboratorDTO,
  ) {
    return this.collaboratorService.update(projectId, userId, data);
  }

  @Delete(":userId")
  @ValidateResourcesIds()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param("projectId", ParseUUIDPipe) projectId: string,
    @Param("userId", ParseUUIDPipe) userId: string,
  ) {
    return this.collaboratorService.remove(projectId, userId);
  }
}
