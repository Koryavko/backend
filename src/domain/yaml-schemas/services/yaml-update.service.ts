import { Injectable, Logger } from '@nestjs/common';
import { FetchYamlsService } from '../../../infrastructure/external/modules/gcp/fetch-yamls.service';

@Injectable()
export class YamlUpdateService {
  private readonly logger = new Logger(YamlUpdateService.name);

  constructor(private readonly fetchYamlsService: FetchYamlsService) {}

  public async sync(): Promise<void> {
    const entities = await this.fetchYamlsService.prepareEntities();

    for (const entity of entities) {
      //сохранение, после реализации доработки yaml файлов
    }
  }
}
