import { Module } from '@nestjs/common';
import { SimpleFarmItemFamilyService } from './item-family.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmItemFamilyService],
	exports: [SimpleFarmItemFamilyService]
})

export class SimpleFarmItemFamilyModule { }
