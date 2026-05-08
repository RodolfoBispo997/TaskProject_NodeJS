import { Test, TestingModule } from "@nestjs/testing";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";
import { PrismaService } from "../../prisma.service";
import { RequestContextService } from "../../common/services/request-context/request-context.service";
import { mockedProjects, mockPaginationQuery } from "./projects.mocks";
import { paginateOutPut } from "../../utils/pagination.utils";
import { Project } from "../../generated/prisma";

describe("ProjectsController", () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  const mockProjectsService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
        {
          provide: PrismaService,
          useValue: {
            $connect: jest.fn(),
          },
        },
        {
          provide: RequestContextService,
          useValue: {
            getUserId: jest.fn().mockReturnValue("user-1"),
          },
        },
      ],
    }).compile();

    controller = await module.resolve<ProjectsController>(ProjectsController);
    service = await module.resolve<ProjectsService>(ProjectsService);
  });

  describe("findAll", () => {
    it("should return a paginated list of projects", async () => {
      const mockedResponse = paginateOutPut<Project>(
        mockedProjects,
        mockedProjects.length,
        mockPaginationQuery,
      );
      jest.spyOn(service, "findAll").mockResolvedValue(mockedResponse);

      const response = await controller.findAll();

      expect(response).toEqual(mockedResponse);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("findOne", () => {
    it("should be able to return a single project by Id", async () => {
      const project = mockedProjects[0];
      const projectId = project.id;
      const expectedResult = {
        ...mockedProjects[0],
        task: [],
      };

      jest.spyOn(service, "findById").mockResolvedValue(expectedResult);

      const response = await controller.findOne(projectId);

      expect(response).toEqual(expectedResult);
      expect(service.findById).toHaveBeenCalledWith(projectId);
      expect(service.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe("create", () => {
    it("should be able to create a new project", async () => {
      const project = mockedProjects[0];

      jest.spyOn(service, "create").mockResolvedValue(project);

      const response = await controller.create({
        name: project.name,
        description: project.description as string,
      });

      expect(response).toEqual(project);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  it("should be able to handle validation", async () => {
    const error = new Error("Name is required");

    jest.spyOn(service, "create").mockRejectedValue(error);

    await expect(
      controller.create({ name: "", description: "" }),
    ).rejects.toThrow("Name is required");
  });

  describe("updated", () => {
    it("should be able to update a project", async () => {
      const project = { ...mockedProjects[0], tasks: [] };

      jest.spyOn(service, "update").mockResolvedValue(project);
      const response = await controller.update(project.id, {
        name: project.name,
        description: project.description as string,
      });

      expect(response).toEqual(project);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe("remove", () => {
    it("should be able to remove a project", async () => {
      jest.spyOn(service, "remove").mockImplementation();
      await controller.remove(mockedProjects[0].id);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
