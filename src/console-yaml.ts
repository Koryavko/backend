import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { YamlUpdateService } from './domain/yaml-schemas/services/yaml-update.service';

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create(AppModule);
    const yamlUpdateService = await app.get(YamlUpdateService);

    await yamlUpdateService.sync();
  } catch (e) {
    Logger.error(`❌  Error starting nest, ${e}`, '', 'Bootstrap', false);
  } finally {
    process.exit(0);
  }
}

bootstrap().catch((e) => {
  Logger.error(`❌  Error starting nest, ${e}`, '', 'Bootstrap', false);

  throw e;
});
