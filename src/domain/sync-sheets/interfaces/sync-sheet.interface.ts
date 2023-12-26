export interface SyncSheetInterface {
  sync(data: string[][]): Promise<number>;
}
