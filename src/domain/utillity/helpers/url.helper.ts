export class URLHelper {
  public static extractDomain(url: string): string {
    try {
      if (!/^http(s)?:\/\//.test(url)) {
        url = 'https://' + url;
      }
      const urlObject = new URL(url);

      return urlObject.hostname.replace(/^www(\d)?\./, '');
    } catch (e) {
      return '';
    }
  }

  public static getQueryFromUrlByParam(url: string, param: string): string {
    try {
      const searchUrl = new URL(url).search;
      const searchParams = new URLSearchParams(searchUrl);

      for (const [key, value] of searchParams.entries()) {
        if (param.toLowerCase() === key.toLowerCase()) {
          return value.trim();
        }
      }

      return null;
    } catch (e) {
      return null;
    }
  }
}
