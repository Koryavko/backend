import { ApiProperty } from '@nestjs/swagger';

export class InstallExtensionResponse {
  @ApiProperty({ type: String, required: true, nullable: false, example: 'd2b3c4d0-5f5d-11eb-ae93-0242ac130002' })
  public uuid: string;

  @ApiProperty({
    type: String,
    required: true,
    nullable: false,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o',
  })
  public token: string;
}
