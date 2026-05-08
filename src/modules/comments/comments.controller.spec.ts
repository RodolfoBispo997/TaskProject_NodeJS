import { Test, TestingModule } from "@nestjs/testing";
import { CommentsController } from "./comments.controller";
import { mockedComments, mockPaginationQuery } from "./comments.mock";
import { CommentsModule } from "./comments.module";
import { CommentsService } from "./comments.service";
import { PrismaService } from "../../prisma.service";
import { RequestContextService } from "../../common/services/request-context/request-context.service";
import { paginateOutPut } from "../../utils/pagination.utils";
import { Comment } from "../../generated/prisma";

describe("CommentsController", () => {
  let controller: CommentsController;
  let service: CommentsService;
  const taskId = "task-1";

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommentsModule],
    })
      .overrideProvider(CommentsService)
      .useValue(service)
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .overrideProvider(RequestContextService)
      .useValue({ getUserId: jest.fn().mockReturnValue("user-1") })
      .compile();

    controller = await module.resolve<CommentsController>(CommentsController);
    service = await module.resolve<CommentsService>(CommentsService);
  });

  describe("findAll", () => {
    it("should return a paginated list of comments", async () => {
      const mockedResponse = paginateOutPut<Comment>(
        mockedComments,
        mockedComments.length,
        mockPaginationQuery,
      );

      jest
        .spyOn(service, "findAllByTasks")
        .mockResolvedValue(mockedResponse as any);

      const response = await controller.findAllByTasks(
        taskId,
        mockPaginationQuery,
      );

      expect(response).toEqual(mockedResponse);
      expect(service.findAllByTasks).toHaveBeenCalledTimes(1);
    });
  });

  describe("findById", () => {
    it("should be able to return a single comment by Id", async () => {
      const comment = mockedComments[0];
      const commentId = comment.id;

      jest.spyOn(service, "findById").mockResolvedValue(comment as any);
      const response = await controller.findById(taskId, commentId);

      expect(response).toEqual(comment);
      expect(service.findById).toHaveBeenCalledWith(taskId, commentId);
      expect(service.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe("create", () => {
    it("should be able to create a new comment", async () => {
      const comment = mockedComments[0];

      jest.spyOn(service, "create").mockResolvedValue(comment as any);

      const response = await controller.create(taskId, {
        content: comment.content,
      });

      expect(response).toEqual(comment);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it("should be able to handle validation errors", async () => {
      const error = new Error("Content is required");

      jest.spyOn(service, "create").mockRejectedValue(error);

      await expect(controller.create(taskId, { content: "" })).rejects.toThrow(
        "Content is required",
      );
    });
  });

  describe("update", () => {
    it("should be able to update a comment", async () => {
      const comment = mockedComments[0];

      jest.spyOn(service, "update").mockResolvedValue(comment as any);

      const response = await controller.update(taskId, comment.id, {
        content: comment.content,
      });

      expect(response).toEqual(comment);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe("remove", () => {
    it("should be able to remove a comment", async () => {
      jest.spyOn(service, "remove").mockImplementation();
      await controller.remove(taskId, mockedComments[0].id);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
