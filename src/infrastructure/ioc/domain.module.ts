import { Module } from '@nestjs/common';
import { DomainController } from '../../presentation/controllers/domain.controller';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule],
  controllers: [DomainController],
  providers: [],
})
export class DomainModule {}
