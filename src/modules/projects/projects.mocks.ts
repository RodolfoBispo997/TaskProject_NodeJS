import { faker } from "@faker-js/faker";
import { QueryPaginationDTO } from "../../common/dtos/query-pagination.dto";
import { Project } from "../../generated/prisma";

export const mockedProjects = faker.helpers.multiple<Project>(
  () => {
    return {
      id: faker.string.uuid(),
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: "user-1",
    };
  },
  { count: 10 },
);

export const mockPaginationQuery: QueryPaginationDTO = {
  page: "1",
  size: "10",
};
