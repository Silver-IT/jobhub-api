import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'body-parser';
import * as dotenv from 'dotenv';
import * as CloneBuffer from 'clone-buffer';
import * as expressBasicAuth from 'express-basic-auth';

import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: process.env.PRODUCTION ? /jdlandscaping\.net$/ : '*',
  });


  app.use(json({
    verify: (req: any, res, buf) => {
      // important to store rawBody for Stripe signature verification
      if (req.headers['stripe-signature'] && Buffer.isBuffer(buf)) {
        req.rawBody = CloneBuffer(buf);
      }
      return true;
    },
  }));

  const seedService = app.get(SeedService);
  if (process.env.PRODUCTION) {
    await seedService.startProductionSeed();
  } else {
    await seedService.startDevelopmentSeed();
  }

  const options = new DocumentBuilder()
    .setTitle('J&D Landscaping API')
    .setDescription('This API service is for J&D Landscaping')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.use('/doc', expressBasicAuth({
    challenge: true,
    users: {
      jddeveloper: 'secret'
    }
  }));
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
