import { ApiProperty } from '@nestjs/swagger';

export class GetDomainListResponse {
  @ApiProperty({
    type: [String],
    description: 'List of domains',
    isArray: true,
    nullable: true,
    example: ['amazon.com', 'ebay.com'],
  })
  public domains: string[];

  constructor(domains: string[]) {
    this.domains = domains;
  }
}
