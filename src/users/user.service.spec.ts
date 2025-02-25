import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when user is found', () => {
      const username = 'valid-user';
      const user = new User();

      beforeEach(() => {
        user.username = username;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
          where: jest.fn().mockReturnThis(),
          cache: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(user),
        } as any);
      });

      it('should return a user', async () => {
        expect(await service.findOne(username)).toEqual(user);
      });

      it('should apply where clause with username', async () => {
        await service.findOne(username);

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repository.createQueryBuilder().where).toHaveBeenCalledWith(
          'username = :username',
          { username },
        );
      });

      it('should apply cache with key and TTL', async () => {
        const cacheKey = `user:${username}`;
        const cacheTTLms = 60000;

        await service.findOne(username);

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repository.createQueryBuilder().cache).toHaveBeenCalledWith(
          cacheKey,
          cacheTTLms,
        );
      });
    });

    describe('when user is not found', () => {
      const username = 'unknown-user';

      beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
          where: jest.fn().mockReturnThis(),
          cache: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(null),
        } as any);
      });

      it('should return null', async () => {
        expect(await service.findOne(username)).toBeNull();
      });
    });
  });
});
