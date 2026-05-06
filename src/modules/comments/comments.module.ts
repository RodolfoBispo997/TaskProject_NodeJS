import { Module } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { PrismaService } from "../../prisma.service";
import { RequestContextService } from "../../common/services/request-context/request-context.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth/jwt-auth.guard";

@Module({
  providers: [
    CommentsService,
    PrismaService,
    RequestContextService,
    JwtAuthGuard,
  ],
  controllers: [CommentsController],
})
export class CommentsModule {}
