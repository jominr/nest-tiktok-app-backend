import { Injectable } from '@nestjs/common';
/*
  `app.service`: 是一个典型的 NestJS 服务类，它包含了应用程序的业务逻辑。
  服务类负责处理数据操作、业务逻辑和与其他模块的交互，通常被注入到控制器或其他服务中使用。
*/
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
