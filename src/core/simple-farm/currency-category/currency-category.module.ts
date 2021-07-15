import { Module } from '@nestjs/common';
import { SimpleFarmCurrencyCategoryService } from './currency-category.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmCurrencyCategoryService],
	exports: [SimpleFarmCurrencyCategoryService]
})

export class SimpleFarmCurrencyCategoryModule { }
