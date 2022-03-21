import { Injectable } from '@nestjs/common';
import { MongoService } from './mongo/mongo.service';

@Injectable()
export class AppService {
  constructor(private readonly mongoService: MongoService) {}

  getHealthStatus(): string {
    return 'Hello World! I am Healthy!';
  }

  getDynamicCredsHello(): string {
    return `MongoDB connection with dynamic creds: ${this.mongoService.getDynamicMongoConnection()}`;
  }

  getStaticCredsHello(): string {
    return `MongoDB connection with static creds: ${this.mongoService.getStaticMongoConnection()}`;
  }
}
