import { Test, TestingModule } from "@nestjs/testing";
import { ProjectsService } from "./projects.service";
import { beforeEach, describe, it } from "node:test";
import expectCookies from "supertest/lib/cookies";

describe("ProjectsService", () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsService],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it("should be defined", () => {
    expectCookies(service).toBeDefined();
  });
});
