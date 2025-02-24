import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicAuthStrategy } from './basic-auth/basic-auth.strategy';
import { UserModule } from '../users/user.module';

@Module({
  imports: [PassportModule, UserModule],
  providers: [BasicAuthStrategy],
})
export class AuthModule {}
