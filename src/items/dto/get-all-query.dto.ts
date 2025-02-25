import { IsEnum, IsOptional, IsRFC3339 } from 'class-validator';
import Status from '../../types/status.enum';

export class GetAllQuery {
  @IsOptional()
  @IsEnum(Status)
  status: Status;

  @IsRFC3339()
  @IsOptional()
  dueDateStart: string;

  @IsRFC3339()
  @IsOptional()
  dueDateEnd: string;
}
