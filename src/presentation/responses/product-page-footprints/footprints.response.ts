import { ApiProperty } from '@nestjs/swagger';

export class FootprintsResponse {
  @ApiProperty({ type: String, isArray: true, example: ['/(product|produit)/S'], nullable: false, uniqueItems: true })
  public uniqueFootprints: string[];

  @ApiProperty({ type: String, isArray: true, example: ['/(product|produit)/S'], nullable: false, uniqueItems: true })
  public domainFootprints: string[];

  constructor(uniqueFootprints: string[], domainFootprints: string[]) {
    this.uniqueFootprints = uniqueFootprints;
    this.domainFootprints = domainFootprints;
  }
}
