import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class BasicAuthGuard extends AuthGuard('basic') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid authentication');
    }

    // save user info in the request context
    context.switchToHttp().getRequest().user = user;

    return user;
  }
}
