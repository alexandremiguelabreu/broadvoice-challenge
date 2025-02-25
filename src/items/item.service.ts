import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import {
  Between,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreateItemBody } from './dto/create-item-body.dto';
import { v4 as uuidv4 } from 'uuid';
import { GetAllQuery } from './dto/get-all-query.dto';
import { UpdateItemBody } from './dto/update-item-body.dto';
import UserInfo from '../types/user-info.type';
import UserRole from '../types/user-role.enum';
import Status from '../types/status.enum';

type ItemFilters = {
  userId: string;
  status: Status;
  dueDate: FindOperator<string>;
};

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(userInfo: UserInfo, data: CreateItemBody): Promise<Item> {
    const itemId = uuidv4();

    const item = this.itemRepository.create({
      itemId,
      userId: userInfo.userId,
      ...data,
    });

    await this.itemRepository.save(item);

    return item;
  }

  async update(
    userInfo: UserInfo,
    itemId: string,
    data: UpdateItemBody,
  ): Promise<Item> {
    const item: Item = await this.getOne(userInfo, itemId);

    item.title = data.title;
    item.description = data.description || null;
    item.status = data.status;
    item.dueDate = data.dueDate || null;

    return await this.itemRepository.save(item);
  }

  getAll(userInfo: UserInfo, filters?: GetAllQuery): Promise<Item[]> {
    const where: Partial<ItemFilters> = {};

    if (userInfo.role !== UserRole.admin) {
      where.userId = userInfo.userId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.dueDateStart && !filters?.dueDateEnd) {
      where.dueDate = MoreThanOrEqual(filters.dueDateStart);
    }

    if (filters?.dueDateEnd && !filters?.dueDateStart) {
      where.dueDate = LessThanOrEqual(filters.dueDateEnd);
    }

    if (filters?.dueDateStart && filters?.dueDateEnd) {
      where.dueDate = Between(filters.dueDateStart, filters.dueDateEnd);
    }

    return this.itemRepository.findBy(where);
  }

  async getOne(userInfo: UserInfo, itemId: string): Promise<Item> {
    let item: Item | null;

    if (userInfo.role === UserRole.admin) {
      item = await this.itemRepository.findOneBy({ itemId });
    } else {
      item = await this.itemRepository.findOneBy({
        userId: userInfo.userId,
        itemId,
      });
    }

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return item;
  }

  async delete(userInfo: UserInfo, itemId: string): Promise<void> {
    if (userInfo.role !== UserRole.admin) {
      const item = await this.itemRepository.findOneBy({
        userId: userInfo.userId,
        itemId,
      });

      if (!item) {
        throw new NotFoundException('Item not found');
      }
    }

    const result = await this.itemRepository.delete(itemId);
    if (result.affected !== 1) {
      throw new NotFoundException('Item not found');
    }
  }
}
