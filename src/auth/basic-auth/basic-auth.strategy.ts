import { BasicStrategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../users/user.service';
import * as bcrypt from 'bcrypt';
import { UserInfo } from '../../types/user-info.type';
import { UserRole } from '../../types/user-role.enum';

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(BasicStrategy) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserInfo | null> {
    const user = await this.userService.findOne(username);

    if (!user) {
      return null;
    }

    const saltRounds: number = 10;
    const hash: string = await bcrypt.hash(password, saltRounds);

    const isMatch: boolean = await bcrypt.compare(password, hash);

    if (!isMatch) {
      return null;
    }

    return { userId: user.userId, role: user.role as UserRole };
  }
}
