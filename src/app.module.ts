import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProjectsModule } from "./modules/projects/projects.module";
import { PrismaService } from "./prisma.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ProjectsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
