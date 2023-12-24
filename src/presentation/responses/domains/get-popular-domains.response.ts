import { ApiProperty } from '@nestjs/swagger';

export class PopularDomainInfo {
  @ApiProperty({ example: 'amazon.de', nullable: false, required: true, type: String })
  public domain: string;

  @ApiProperty({ example: 100, default: 0, type: Number, nullable: false, required: true })
  public rating: number;

  @ApiProperty({ example: 'https://amazon.de', nullable: false, required: true, type: String, format: 'url' })
  public link: string;

  @ApiProperty({
    example: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    format: 'url',
  })
  public logo: string;

  constructor(domain: string, rating: number, link: string, logo: string) {
    this.domain = domain;
    this.rating = rating;
    this.link = link;
    this.logo = logo;
  }
}

export class GetPopularDomainsResponse {
  @ApiProperty({ example: PopularDomainInfo, required: true, type: PopularDomainInfo, isArray: true, nullable: false })
  public domains: PopularDomainInfo[];

  constructor(domains: PopularDomainInfo[]) {
    this.domains = domains;
  }
}
