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
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const result = await this.projectsService.findById(id);

    if (!result) {
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }

    return result;
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
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() data: ProjectRequestDTO,
  ) {
    const result = await this.projectsService.findById(id);

    if (!result) {
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }

    return this.projectsService.update(id, data);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    const result = await this.projectsService.findById(id);

    if (!result) {
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }

    return this.projectsService.remove(id);
  }
}
