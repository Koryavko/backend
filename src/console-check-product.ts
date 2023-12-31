import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { CheckProductConsole } from './domain/analyze/consoles/check-product.console';
import { AnalyzeModule } from './infrastructure/ioc/analyze.module';

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create(AnalyzeModule);
    const checkProductService = await app.get(CheckProductConsole);

    await checkProductService.sync();
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
