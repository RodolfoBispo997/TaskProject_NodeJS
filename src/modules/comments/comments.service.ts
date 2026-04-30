import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { CommentRequestDTO } from "./comments.dto";
import { RequestContextService } from "../../common/services/request-context/request-context.service";

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}

  findAllByTasks(taskId: string) {
    return this.prisma.comment.findMany({
      where: {
        taskId,
      },
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
    });
  }

  findById(taskId: string, commentId: string) {
    return this.prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            projectId: true,
          },
        },
      },
    });
  }

  create(taskId: string, data: CommentRequestDTO) {
    const userId = this.requestContext.getUserId();
    return this.prisma.comment.create({
      data: {
        content: data.content,
        taskId,
        authorId: userId, //TODO - CHange User ID
      },
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
    });
  }

  async update(taskId: string, commentId: string, data: CommentRequestDTO) {
    const userId = this.requestContext.getUserId();
    const existingComment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId,
        authorId: userId,
      },
    });

    if (!existingComment) {
      throw new NotFoundException("Comment not found");
    }

    return this.prisma.comment.update({
      where: {
        id: commentId,
      },
      data,
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
    });
  }

  async remove(taskId: string, commentId: string) {
    const userId = this.requestContext.getUserId();
    const existingComment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId,
        authorId: userId,
      },
    });

    if (!existingComment) {
      throw new NotFoundException("Comment not found");
    }

    await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
}
