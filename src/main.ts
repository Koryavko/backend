import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

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

    const url = new URL(`https://${configService.get('API_URL')}`);
    if (process.env.NODE_ENV !== 'production' && url.toString().includes('localhost')) {
      url.protocol = 'http';
    }

    /*
     * Middlewares
     */

    app.useGlobalPipes(new ValidationPipe());

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
      // .addApiKey(
      //   {
      //     type: 'apiKey', // this should be apiKey
      //     name: 'user-uuid', // this is the name of the key you expect in header
      //     in: 'header',
      //   },
      //   'user-uuid', // this is the name to show and used in swagger + to controller @ApiSecurity('user-uuid')
      // )
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
      )
      .addServer(`${url.toString()}api`)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      useGlobalPrefix: true,
    });

    const apiUser = configService.get('API_DOC_USER', 'admin');
    const apiPass = configService.get('API_DOC_PASSWORD', '7f4SfmhuiwqzyM'); // 7f4SfmhuiwqzyM

    app.use(
      '/api/docs',
      basicAuth({
        challenge: true,
        users: { [apiUser]: apiPass },
      }),
    );

    /*
     * Start server
     */
    const PORT = +configService.get<string>('PORT', '3000');
    await app.listen(PORT);

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
