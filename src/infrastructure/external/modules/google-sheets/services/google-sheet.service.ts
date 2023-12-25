import { Injectable, Logger } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleSheetService {
  private readonly logger = new Logger(GoogleSheetService.name);

  private readonly scopes: string[] = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

  private sheets: sheets_v4.Sheets;

  private readonly range = '!A:Z';

  constructor(private readonly configService: ConfigService) {
    this.initClient()
      .then(() => {
        this.logger.log(`Google Sheet Client initialized`);
      })
      .catch((e) => {
        this.logger.error(`Error initializing Google Sheet Client`, e.stack);
      });
  }

  private async initClient(): Promise<void> {
    const localAuth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    this.sheets = google.sheets({
      version: 'v4',
      auth: localAuth,
    });
  }

  private async checkAccess(spreadsheetId: string, gid: number): Promise<sheets_v4.Schema$Sheet> {
    const sheets = await this.sheets.spreadsheets.get({ spreadsheetId });

    const targetSheet = sheets.data.sheets.find((sheetData) => sheetData.properties.sheetId === gid);
    if (!targetSheet) {
      throw new Error(`Sheet with id ${gid} was not found`);
    }

    return targetSheet;
  }

  private async getValues(spreadsheetId: string, targetSheet: sheets_v4.Schema$Sheet): Promise<string[][]> {
    const values = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${targetSheet.properties.title}'${this.range}`,
    });

    if (!values || !values.data || !values.data.values) {
      return [[]];
    }

    return values.data.values;
  }

  private getGoogleKeys(link: string): string[] {
    return (link.match(/d\/([^/]+).+gid=([\d]+)/) || []).slice(1, 3);
  }

  public async execute(link: string): Promise<string[][]> {
    const [spreadsheetId, gid] = this.getGoogleKeys(link);

    const targetSheet = await this.checkAccess(spreadsheetId, Number(gid));

    return this.getValues(spreadsheetId, targetSheet);
  }
}
