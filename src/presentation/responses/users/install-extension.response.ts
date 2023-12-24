import { ApiProperty } from '@nestjs/swagger';

export class InstallExtensionResponse {
  @ApiProperty({ type: String, required: true, nullable: false, example: 'd2b3c4d0-5f5d-11eb-ae93-0242ac130002' })
  public uuid: string;

  constructor(uuid: string) {
    this.uuid = uuid;
  }
}
