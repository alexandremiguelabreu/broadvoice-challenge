import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './item.controller';
import { ItemService } from './item.service';
import { BasicAuthGuard } from '../auth/basic-auth/basic-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GetAllQuery } from './dto/get-all-query.dto';
import { ItemResponse } from './dto/item-response.dto';
import { Item } from './entities/item.entity';
import UserInfo from '../types/user-info.type';
import UserRole from '../types/user-role.enum';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemService;

  const mockItemService = {
    getAll: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUser: UserInfo = {
    userId: 'b293d9a9-1d1a-4729-a333-ea4435620b48',
    role: UserRole.admin,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [{ provide: ItemService, useValue: mockItemService }],
    })
      .overrideGuard(BasicAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllItems', () => {
    it('should return an empty array when no items exists', async () => {
      const items: Item[] = [];
      const result: ItemResponse[] = [];
      jest.spyOn(service, 'getAll').mockResolvedValue(items);

      expect(
        await controller.getAllItems({ user: mockUser }, {} as GetAllQuery),
      ).toStrictEqual(result);
    });

    it('should return a non empty array when one item exists', async () => {
      const item: Item = {
        itemId: '9b764d86-fd26-4d0a-882c-4a0d1d64f5f0',
        userId: 'b293d9a9-1d1a-4729-a333-ea4435620b48',
        title: 'Test',
        description: 'Test',
        status: 'active',
        dueDate: '2025-01-02T03:00:00Z',
      };
      const result: ItemResponse = {
        itemId: '9b764d86-fd26-4d0a-882c-4a0d1d64f5f0',
        title: 'Test',
        description: 'Test',
        status: 'active',
        dueDate: '2025-01-02T03:00:00Z',
      };
      jest.spyOn(service, 'getOne').mockResolvedValue(item);

      expect(
        await controller.getOneItem({ user: mockUser }, { itemId: '1' }),
      ).toStrictEqual(result);
    });
  });
});
