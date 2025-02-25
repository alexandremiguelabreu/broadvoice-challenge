import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | null> {
    const cacheKey: string = `user:${username}`;
    const cacheTTLms: number = 60000;

    return this.userRepository
      .createQueryBuilder()
      .where('username = :username', { username })
      .cache(cacheKey, cacheTTLms)
      .getOne();
  }
}
