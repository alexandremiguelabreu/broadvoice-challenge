import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { CreateItemBody } from './dto/create-item-body.dto';
import UserInfo from '../types/user-info.type';
import UserRole from '../types/user-role.enum';
import Status from '../types/status.enum';

jest.mock('uuid', () => ({
  v4: () => '9b764d86-fd26-4d0a-882c-4a0d1d64f5f0',
}));

describe('ItemService', () => {
  let service: ItemService;
  let repository: Repository<Item>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: getRepositoryToken(Item),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    repository = module.get<Repository<Item>>(getRepositoryToken(Item));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const userInfo: UserInfo = {
      userId: 'b293d9a9-1d1a-4729-a333-ea4435620b48',
      role: UserRole.regular,
    };

    const createItemBody: CreateItemBody = {
      title: 'Test Item',
      description: 'Test Description',
      status: Status.pending,
      dueDate: '2023-10-10T12:00:00Z',
    };

    const item = {
      ...createItemBody,
      itemId: '9b764d86-fd26-4d0a-882c-4a0d1d64f5f0',
      userId: 'b293d9a9-1d1a-4729-a333-ea4435620b48',
    };

    describe('when saving in the repository is successful', () => {
      beforeEach(() => {
        jest.spyOn(repository, 'create').mockReturnValue(item);
        jest.spyOn(repository, 'save').mockResolvedValue(item);
      });

      it('should return the created item', async () => {
        expect(await service.create(userInfo, createItemBody)).toEqual(item);
      });

      it('should call repository.create with the correct arguments', async () => {
        await service.create(userInfo, createItemBody);

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repository.create).toHaveBeenCalledWith({
          itemId: '9b764d86-fd26-4d0a-882c-4a0d1d64f5f0',
          userId: 'b293d9a9-1d1a-4729-a333-ea4435620b48',
          ...createItemBody,
        });
      });
    });

    describe('when saving in the repository is not successful', () => {
      beforeEach(() => {
        jest.spyOn(repository, 'create').mockReturnValue(item);
        jest
          .spyOn(repository, 'save')
          .mockRejectedValue(new Error('error message'));
      });

      it('should throw an error', async () => {
        await expect(service.create(userInfo, createItemBody)).rejects.toThrow(
          'error message',
        );
      });
    });
  });
});
