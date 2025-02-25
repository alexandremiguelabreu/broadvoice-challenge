import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsRFC3339,
  IsString,
  MaxLength,
} from 'class-validator';
import Status from '../../types/status.enum';

export class CreateItemBody {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsOptional()
  @IsRFC3339()
  dueDate: string;
}
