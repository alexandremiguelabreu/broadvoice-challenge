import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateItemParams {
  @IsNotEmpty()
  @IsUUID(4)
  itemId: string;
}
