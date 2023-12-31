import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ScrapflyViewModel {
  public content: string;

  public duration: number;

  public logUrl: string;

  public static createFromRawApiResponse(rawResponse: Record<string, any>): ScrapflyViewModel {
    return plainToClass(ScrapflyViewModel, {
      content: rawResponse?.data?.result?.content,
      duration: rawResponse?.data?.result?.duration,
      logUrl: rawResponse?.data?.result?.log_url,
    });
  }
}
