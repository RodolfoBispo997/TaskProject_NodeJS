import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { TaskListItemDTO, TaskRequestDTO } from "./tasks.dto";
import { QueryPaginationDTO } from "../../common/dtos/query-pagination.dto";
import { paginate, paginateOutPut } from "../../utils/pagination.utils";

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAllByProject(projectId: string, query?: QueryPaginationDTO) {
    const tasks = await this.prisma.task.findMany({
      ...paginate(query),
      where: {
        projectId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        assigned: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    const total = await this.prisma.task.count({
      where: {
        projectId,
      },
    });

    return paginateOutPut<TaskListItemDTO>(tasks, total, query);
  }

  async findById(projectId: string, taskId: string) {
    return this.prisma.task.findFirst({
      where: {
        projectId: projectId,
        id: taskId,
      },
      include: {
        assigned: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async create(projectId: string, data: TaskRequestDTO) {
    return this.prisma.task.create({
      data: {
        ...data,
        projectId,
      },
      include: {
        assigned: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  async update(projectId: string, taksId: string, data: TaskRequestDTO) {
    return this.prisma.task.update({
      where: {
        projectId: projectId,
        id: taksId,
      },
      data,
      include: {
        assigned: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
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
