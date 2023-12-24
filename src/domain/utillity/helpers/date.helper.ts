export class DateHelper {
  public static diffInDays(start: Date, end: Date): number {
    const utc1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const utc2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
  }

  public static getTimeToEndOfTheDay(): number {
    const now = new Date();

    const end = new Date();
    end.setUTCHours(23, 59, 59, 999);

    return end.getTime() - now.getTime();
  }

  public static daysAgo(days: number): Date {
    const ago = new Date(new Date().setUTCDate(new Date().getUTCDate() - days));
    ago.setUTCHours(23, 59, 59, 999);

    return ago;
  }
}
