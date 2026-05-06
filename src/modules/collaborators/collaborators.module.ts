import { Module } from "@nestjs/common";
import { CollaboratorsService } from "./collaborators.service";
import { CollaboratorsController } from "./collaborators.controller";
import { PrismaService } from "../../prisma.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth/jwt-auth.guard";
import { RequestContextService } from "../../common/services/request-context/request-context.service";

@Module({
  providers: [
    CollaboratorsService,
    PrismaService,
    JwtAuthGuard,
    RequestContextService,
  ],
  controllers: [CollaboratorsController],
})
export class CollaboratorsModule {}
