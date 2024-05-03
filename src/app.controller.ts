import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/*
  `app.controller`: 是一个典型的 NestJS 控制器类，它负责处理 HTTP 请求并返回相应的 HTTP 响应。
  控制器类包含了一组由装饰器修饰的 HTTP 路由处理方法，用于定义应用程序的 API 路由和处理逻辑。
*/

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
