import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import {
  ProjectFullDTO,
  ProjectListItemDTO,
  ProjectRequestDTO,
} from "./projects.dto";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { ValidateResourcesIds } from "../../common/decorators/validate-resources-ids.decorator";
import { ValidateResourcesIdsInterceptor } from "../../common/interceptors/validate-resources-ids.interceptor";
import { AuthenticatedUser } from "../../common/decorators/authenticated-user.decorator";
import type { User } from "../../generated/prisma";
import { JwtAuthGuard } from "../../common/guards/jwt-auth/jwt-auth.guard";
import { QueryPaginationDTO } from "../../common/dtos/query-pagination.dto";
import { ApiPaginatedResponse } from "../../common/swagger/api-paginated-response";

@Controller({
  version: "1",
  path: "projects",
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("jwt")
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @ApiPaginatedResponse(ProjectListItemDTO)
  findAll(@Query() query?: QueryPaginationDTO) {
    return this.projectsService.findAll(query);
  }

  @Get(":projectId")
  @ApiResponse({
    type: [ProjectFullDTO],
  })
  @ValidateResourcesIds()
  async findOne(@Param("projectId", ParseUUIDPipe) id: string) {
    return await this.projectsService.findById(id);
  }

  @Post()
  @ApiResponse({
    type: ProjectListItemDTO,
  })
  create(@Body() data: ProjectRequestDTO, @AuthenticatedUser() user: User) {
    return this.projectsService.create(data);
  }

  @Put(":projectId")
  @ApiResponse({
    type: ProjectListItemDTO,
  })
  @ValidateResourcesIds()
  async update(
    @Param("projectId", ParseUUIDPipe) id: string,
    @Body() data: ProjectRequestDTO,
  ) {
    return this.projectsService.update(id, data);
  }

  @Delete(":projectId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  async remove(@Param("projectId", ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id);
  }
}
