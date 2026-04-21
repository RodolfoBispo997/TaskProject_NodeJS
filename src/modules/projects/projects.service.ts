import { Injectable } from "@nestjs/common";
import { ProjectRequestDTO } from "./projects.dto";
import { PrismaService } from "../../prisma.service";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany();
  }

  findById(id: string) {
    return this.prisma.project.findFirst({
      where: {
        id,
      },
    });
  }

  create(data: ProjectRequestDTO) {
    return this.prisma.project.create({
      data,
    });
  }

  update(id: string, data: ProjectRequestDTO) {
    return this.prisma.project.update({
      where: {
        id,
      },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.project.delete({
      where: {
        id,
      },
    });
  }
}
