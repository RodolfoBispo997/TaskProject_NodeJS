import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { PrismaService } from "../../prisma.service";
import { RequestContextModule } from "../../common/services/request-context/request-context.module";
import { JwtAuthGuard } from "../../common/guards/jwt-auth/jwt-auth.guard";
import { RequestContextService } from "../../common/services/request-context/request-context.service";

@Module({
  imports: [RequestContextModule],
  controllers: [TasksController],
  providers: [TasksService, PrismaService, JwtAuthGuard, RequestContextService],
})
export class TasksModule {}
