import { Injectable } from '@nestjs/common';

@Injectable()
export class ScraperViewModel {
  constructor(content: string, duration: number) {
    this.content = content;
    this.duration = duration;
  }

  public content: string;

  public duration: number;
}
