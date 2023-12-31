import { Module } from '@nestjs/common';
import { DomainModule } from './domain.module';
import { ProductModule } from './product.module';
import { YamlModule } from './yaml.module';
import { CheckProductConsole } from '../../domain/analyze/consoles/check-product.console';
import { CheckProductService } from '../../domain/analyze/services/check-product.service';
import { ScenarioService } from '../../domain/analyze/services/scenario.service';
import { DirectApiFactory } from '../../domain/analyze/factories/direct-api.factory';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ScenarioRunnerService } from '../../domain/analyze/services/scenario-runner.service';
import { ScraperFactory } from '../../domain/analyze/factories/scraper.factory';
import { HtmlParserFactory } from '../../domain/analyze/factories/html-parser.factory';

@Module({
  imports: [
    DomainModule,
    ProductModule,
    YamlModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT_ANALYZE', 120000),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS_ANALYZE', 0),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    CheckProductConsole,
    CheckProductService,
    ScenarioService,
    DirectApiFactory,
    ScenarioRunnerService,
    ScraperFactory,
    HtmlParserFactory,
  ],
})
export class AnalyzeModule {}
