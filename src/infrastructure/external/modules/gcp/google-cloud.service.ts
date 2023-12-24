import { Injectable, Logger } from '@nestjs/common';
import { DownloadOptions, DownloadResponse, Storage } from '@google-cloud/storage';

@Injectable()
export class GoogleCloudService {
  private readonly logger = new Logger(GoogleCloudService.name);

  private readonly storageClient = new Storage();

  public async getDirectoryFiles(bucket: string, path: string): Promise<string[]> {
    this.logger.log(`Getting file list in the ${path} directory in the ${bucket} bucket`);

    const [filesResponse] = await this.storageClient.bucket(bucket).getFiles({ prefix: path });

    return filesResponse.map((file) => file.name).filter((item) => item !== path);
  }

  public async download(bucket: string, filename: string, options: DownloadOptions): Promise<DownloadResponse> {
    return this.storageClient.bucket(bucket).file(filename).download(options);
  }
}
