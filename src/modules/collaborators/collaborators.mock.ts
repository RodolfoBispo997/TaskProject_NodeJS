import { faker } from "@faker-js/faker";
import { QueryPaginationDTO } from "../../common/dtos/query-pagination.dto";
import { ProjectCollaborator } from "../../generated/prisma";

export const mockPaginationQuery: QueryPaginationDTO = {
  page: "1",
  size: "10",
};

export const mockedCollaborators = faker.helpers.multiple<ProjectCollaborator>(
  () => ({
    id: faker.string.uuid(),
    role: "EDITOR",
    createdAt: new Date(),
    projectId: "project-1",
    userId: "user-1",
  }),
  { count: 5 },
);
