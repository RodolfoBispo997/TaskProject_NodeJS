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
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
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

  async remove(id: string) {
    await this.prisma.task.deleteMany({
      where: {
        projectId: id,
      },
    });
    return this.prisma.project.delete({
      where: {
        id,
      },
    });
  }
}
