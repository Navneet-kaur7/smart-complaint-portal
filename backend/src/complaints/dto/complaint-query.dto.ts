import { IsOptional, IsEnum, IsString, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ComplaintStatus } from '@prisma/client';

export class ComplaintQueryDto {
  @IsOptional()
  @IsEnum(ComplaintStatus)
  status?: ComplaintStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}