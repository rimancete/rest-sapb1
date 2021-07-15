import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // const options = new DocumentBuilder()
  //                     .setTitle('Integração FarmmOne [Homologação]')
  //                     .setDescription('API de integração FarmmOne.')
  //                     .setVersion('1.0')                      
  //                     .build();                      

  const option = {
    swaggerUrl: 'J4816-integracao-farmm_one_homologacao-1.0-swagger.json'
  }
  // const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, null, option);

  app.enableCors();

  await app.listen(8085);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();