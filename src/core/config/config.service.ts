import { Injectable } from '@nestjs/common';
import { Config } from './interfaces';
import * as fs from 'fs';

@Injectable()
export class ConfigService {
  private readonly envConfig: Config;

  constructor(filePath?: string) {
    const rawJson: any = fs.readFileSync(filePath);
    this.envConfig = JSON.parse(rawJson);
  }

  get(): Config {
    return this.envConfig;
  }

}