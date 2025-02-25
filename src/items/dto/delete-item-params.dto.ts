import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteItemParams {
  @IsNotEmpty()
  @IsUUID(4)
  itemId: string;
}
