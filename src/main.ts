import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000,
    }),
  );
  app.use(
    rateLimit({
      windowMs: 1000 * 60 * 60,
      max: 1000, // 1000 requests por windowMs
      message: '⚠️  Too many request created from this IP, please try again after an hour',
    }),
  );

  await app.listen(3000);
}
bootstrap();
