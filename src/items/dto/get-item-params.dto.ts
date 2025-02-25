import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetItemParams {
  @IsNotEmpty()
  @IsUUID(4)
  itemId: string;
}
