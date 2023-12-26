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

  public static getUrlWWW(url: string): string[] {
    const result = [];

    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
    const urlObject = new URL(urlWithProtocol);
    urlObject.protocol = 'https';

    if (urlObject.hostname.startsWith('www')) {
      const wwwUrl = `${urlObject.protocol}//${urlObject.hostname}${urlObject.pathname}${urlObject.search}${urlObject.hash}`;
      result.push(wwwUrl);

      const nonWwwHostname = urlObject.hostname.replace('www.', '');

      const nonWwwUrl = `${urlObject.protocol}//${nonWwwHostname}${urlObject.pathname}${urlObject.search}${urlObject.hash}`;
      result.push(nonWwwUrl);
    }

    if (!urlObject.hostname.startsWith('www')) {
      const nonWwwUrl = `${urlObject.protocol}//${urlObject.hostname}${urlObject.pathname}${urlObject.search}${urlObject.hash}`;
      result.push(nonWwwUrl);

      const wwwHostname = `www.${urlObject.hostname}`;
      const wwwUrl = `${urlObject.protocol}//${wwwHostname}${urlObject.pathname}${urlObject.search}${urlObject.hash}`;

      result.push(wwwUrl);
    }

    return result;
  }
}
