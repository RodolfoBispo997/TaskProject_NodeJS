import { Module } from "@nestjs/common";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";
import { PrismaService } from "../../prisma.service";
import { RequestContextService } from "../../common/services/request-context/request-context.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth/jwt-auth.guard";

@Module({
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    PrismaService,
    RequestContextService,
    JwtAuthGuard,
  ],
})
export class ProjectsModule {}
