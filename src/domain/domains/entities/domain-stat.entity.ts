export class DomainStatEntity {
  public id: number;

  public domain: string;

  public scraper: number;

  public scrapfly: number;

  public preferredScraper: string;

  public preferredParser: string;

  public selector: number;

  public openGraph: number;

  public jsonLd: number;

  public meta: number;

  public fnac = 0;

  public shopify = 0;

  public diffbot = 0;

  public collection = 0;

  public failed = 0;

  public totalRuns: number;

  public createdAt: Date;

  public updatedAt: Date;

  public deletedAt: Date;

  constructor(
    domain: string,
    scraper: number,
    scrapfly: number,
    preferredScraper: string,
    preferredParser: string,
    totalRuns: number,
    selector: number,
    openGraph: number,
    jsonLd: number,
    meta: number,
    fnac: number,
    shopify: number,
    diffbot: number,
    collection: number,
    failed: number,
  ) {
    this.domain = domain;
    this.preferredScraper = preferredScraper;
    this.preferredParser = preferredParser;
    this.totalRuns = totalRuns;
    this.scraper = scraper;
    this.scrapfly = scrapfly;
    this.selector = selector;
    this.openGraph = openGraph;
    this.jsonLd = jsonLd;
    this.meta = meta;
    this.fnac = fnac;
    this.shopify = shopify;
    this.diffbot = diffbot;
    this.collection = collection;
    this.failed = failed;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.deletedAt = null;
  }
}
