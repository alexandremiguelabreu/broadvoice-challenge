import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { DeleteItemParams } from './dto/delete-item-params.dto';
import { BasicAuthGuard } from '../auth/basic-auth/basic-auth.guard';
import { GetItemParams } from './dto/get-item-params.dto';
import { CreateItemBody } from './dto/create-item-body.dto';
import { GetAllQuery } from './dto/get-all-query.dto';
import { UpdateItemParams } from './dto/update-item-params.dto';
import { UpdateItemBody } from './dto/update-item-body.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import UserInfo from '../types/user-info.type';
import { ItemResponse } from './dto/item-response.dto';

@UseGuards(ThrottlerGuard)
@UseGuards(BasicAuthGuard)
@Controller('items')
export class ItemsController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async getAllItems(
    @Req() req: { user: UserInfo },
    @Query() filters: GetAllQuery,
  ): Promise<ItemResponse[]> {
    const items = await this.itemService.getAll(req.user, filters);

    return items.map((item) => this.convertItemToResponse(item));
  }

  @Get(':itemId')
  async getOneItem(
    @Req() req: { user: UserInfo },
    @Param() params: GetItemParams,
  ): Promise<ItemResponse> {
    const item = await this.itemService.getOne(req.user, params.itemId);

    return this.convertItemToResponse(item);
  }

  @Post()
  async createItem(
    @Req() req: { user: UserInfo },
    @Body() data: CreateItemBody,
  ): Promise<ItemResponse> {
    const item = await this.itemService.create(req.user, data);

    return this.convertItemToResponse(item);
  }

  @Put(':itemId')
  async updateItem(
    @Req() req: { user: UserInfo },
    @Param() params: UpdateItemParams,
    @Body() data: UpdateItemBody,
  ): Promise<ItemResponse> {
    const item = await this.itemService.update(req.user, params.itemId, data);

    return this.convertItemToResponse(item);
  }

  @Delete(':itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Req() req: { user: UserInfo },
    @Param() params: DeleteItemParams,
  ): Promise<void> {
    return this.itemService.delete(req.user, params.itemId);
  }

  private convertItemToResponse(item: Item): ItemResponse {
    return {
      itemId: item.itemId,
      title: item.title,
      description: item.description,
      status: item.status,
      dueDate: item.dueDate,
    };
  }
}
