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
import { ProjectsService } from "./projects.service";
import { ProjectListItemDTO, ProjectRequestDTO } from "./projects.dto";
import { ApiResponse } from "@nestjs/swagger";

@Controller({
  version: "1",
  path: "projects",
})
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @ApiResponse({
    type: [ProjectListItemDTO],
  })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(":id")
  @ApiResponse({
    type: [ProjectListItemDTO],
  })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.projectsService.findById(id);
  }

  @Post()
  @ApiResponse({
    type: ProjectListItemDTO,
  })
  create(@Body() data: ProjectRequestDTO) {
    return this.projectsService.create(data);
  }

  @Put(":id")
  @ApiResponse({
    type: ProjectListItemDTO,
  })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() data: ProjectRequestDTO,
  ) {
    return this.projectsService.update(id, data);
  }

  @Delete("id")
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param("id", ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id);
  }
}
