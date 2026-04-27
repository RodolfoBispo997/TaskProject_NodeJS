import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { TaskDTOList } from "./tasks.dto";

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAllByProject(projectId: string) {
    return this.prisma.task.findMany({
      where: {
        projectId,
      },
    });
  }

  async findById(projectId: string, taskId: string) {
    return this.prisma.task.findFirst({
      where: {
        projectId: projectId,
        id: taskId,
      },
    });
  }

  async create(projectId: string, data: any) {
    return this.prisma.task.create({
      data: {
        ...data,
        projectId,
      },
    });
  }

  async update(projectId: string, taksId: string, data: any) {
    return this.prisma.task.update({
      where: {
        projectId: projectId,
        id: taksId,
      },
      data,
    });
  }

  async delete(projectId: string, taskId: string) {
    await this.prisma.task.delete({
      where: {
        id: taskId,
        projectId,
      },
    });
  }
}
