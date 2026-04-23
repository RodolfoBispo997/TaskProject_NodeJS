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
  UseInterceptors,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { ProjectListItemDTO, ProjectRequestDTO } from "./projects.dto";
import { ApiResponse } from "@nestjs/swagger";
import { ValidateResourcesIds } from "../../common/decorators/validate-resources-ids.decorator";
import { ValidateResourcesIdsInterceptor } from "../../common/interceptors/validate-resources-ids.interceptor";

@Controller({
  version: "1",
  path: "projects",
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @ApiResponse({
    type: [ProjectListItemDTO],
  })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(":projectId")
  @ApiResponse({
    type: [ProjectListItemDTO],
  })
  @ValidateResourcesIds()
  async findOne(@Param("projectId", ParseUUIDPipe) id: string) {
    return await this.projectsService.findById(id);
  }

  @Post()
  @ApiResponse({
    type: ProjectListItemDTO,
  })
  create(@Body() data: ProjectRequestDTO) {
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
  async delete(@Param("projectId", ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id);
  }
}
