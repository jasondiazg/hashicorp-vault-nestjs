import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  getHealthStatus(): string {
    return this.appService.getHealthStatus();
  }

  @Get('/dynamic')
  getDynamic(): string {
    return this.appService.getDynamicCredsHello();
  }

  @Get('/static')
  getStatic(): string {
    return this.appService.getStaticCredsHello();
  }
}
