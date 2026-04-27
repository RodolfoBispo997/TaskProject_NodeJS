import { Module } from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { CollaboratorsController } from './collaborators.controller';

@Module({
  providers: [CollaboratorsService],
  controllers: [CollaboratorsController]
})
export class CollaboratorsModule {}
