import { EntitySchema } from 'typeorm';
import { BaseMapper } from '../base.mapper';
import { DomainStatEntity } from '../../../../domain/domains/entities/domain-stat.entity';

export const DomainStatMapper = new EntitySchema<DomainStatEntity>({
  name: 'DomainStatEntity',
  tableName: 'domain_stats',
  target: DomainStatEntity,
  columns: {
    ...BaseMapper,
    domain: {
      name: 'domain',
      type: String,
      length: 255,
      nullable: false,
    },
    preferredScraper: {
      name: 'preferred_scraper',
      type: String,
      nullable: true,
    },
    preferredParser: {
      name: 'preferred_parser',
      type: String,
      nullable: true,
    },
    diffbot: {
      name: 'diffbot',
      type: Number,
      default: 0,
      nullable: false,
    },
    shopify: {
      name: 'shopify',
      type: Number,
      default: 0,
      nullable: false,
    },
    scraper: {
      name: 'scraper',
      type: Number,
      default: 0,
      nullable: false,
    },
    scrapfly: {
      name: 'scrapfly',
      type: Number,
      default: 0,
      nullable: false,
    },
    selector: {
      name: 'selector',
      type: Number,
      default: 0,
      nullable: false,
    },
    openGraph: {
      name: 'open_graph',
      type: Number,
      default: 0,
      nullable: false,
    },
    jsonLd: {
      name: 'json_ld',
      type: Number,
      default: 0,
      nullable: false,
    },
    meta: {
      name: 'meta',
      type: Number,
      default: 0,
      nullable: false,
    },
    fnac: {
      name: 'fnac',
      type: Number,
      default: 0,
      nullable: false,
    },
    collection: {
      name: 'collection',
      type: Number,
      default: 0,
      nullable: false,
    },
    failed: {
      name: 'failed',
      type: Number,
      default: 0,
      nullable: false,
    },
    totalRuns: {
      name: 'total_runs',
      type: Number,
      default: 0,
      nullable: false,
    },
  },
  orderBy: {
    id: 'ASC',
  },
  relations: {},
});
