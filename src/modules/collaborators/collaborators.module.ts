import { Module } from "@nestjs/common";
import { CollaboratorsService } from "./collaborators.service";
import { CollaboratorsController } from "./collaborators.controller";
import { PrismaService } from "../../prisma.service";

@Module({
  providers: [CollaboratorsService, PrismaService],
  controllers: [CollaboratorsController],
})
export class CollaboratorsModule {}
