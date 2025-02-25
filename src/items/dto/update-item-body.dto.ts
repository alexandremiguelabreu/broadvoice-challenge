import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsRFC3339,
  IsString,
  MaxLength,
} from 'class-validator';
import Status from '../../types/status.enum';

export class UpdateItemBody {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsOptional()
  @IsRFC3339()
  dueDate: string | null;
}
