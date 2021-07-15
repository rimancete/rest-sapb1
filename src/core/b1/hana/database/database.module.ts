import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigModule } from '../../../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [DatabaseService],
  exports: [ConfigModule, DatabaseService]
})

export class DatabaseModule {}
