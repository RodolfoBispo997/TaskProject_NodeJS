import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProjectsModule } from "./modules/projects/projects.module";
import { PrismaService } from "./prisma.service";
import { ConfigModule } from "@nestjs/config";
import { TasksModule } from "./modules/tasks/tasks.module";
import { UsersModule } from "./modules/users/users.module";
import { CollaboratorsModule } from './collaborators/collaborators.module';

@Module({
  imports: [
    ProjectsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TasksModule,
    UsersModule,
    CollaboratorsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
