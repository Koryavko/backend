import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create(AppModule, {
      cors: true,
      logger:
        process.env.APP_ENV === 'production' ? ['log', 'error', 'warn'] : ['log', 'debug', 'error', 'verbose', 'warn'],
    });
    const configService = app.get(ConfigService);
    Logger.log(`Environment: ${configService.get('APP_ENV')}`, 'Bootstrap');

    app.setGlobalPrefix('api');
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

    /*
     * Swagger
     */
    const config = new DocumentBuilder()
      .setTitle('Koryavko API')
      .setDescription(
        'API documentation for the extension to work with reminders of product availability or price reduction',
      )
      .setVersion('1.0')
      .addTag('users')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      useGlobalPrefix: true,
    });

    /*
     * Start server
     */
    const PORT = +configService.get<string>('PORT', '3000');
    await app.listen(PORT);

    const url = new URL(`https://${configService.get('API_URL')}`);
    if (process.env.NODE_ENV !== 'production' && url.toString().includes('localhost')) {
      url.protocol = 'http';
    }
    Logger.log(`🚀  Server ready at ${url.toString()}`);

    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }
  } catch (e) {
    Logger.error(`❌  Error starting server, message: ${e.message}`, e.trace);
    process.exit(0);
  }
}

bootstrap();
