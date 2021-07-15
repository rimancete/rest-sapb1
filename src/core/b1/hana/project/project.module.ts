import { Module } from '@nestjs/common';
import { HanaProjectService } from './project.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaProjectService],
  exports: [HanaProjectService]
})

export class HanaProjectModule {}
