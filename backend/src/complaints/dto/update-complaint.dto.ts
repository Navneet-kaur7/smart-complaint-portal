import { IsOptional, IsString, MaxLength, MinLength, IsEnum } from 'class-validator';
import { ComplaintStatus } from '@prisma/client';

export class UpdateComplaintDto {
  @IsString()
  @IsOptional()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(100, { message: 'Title cannot exceed 100 characters' })
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;

  @IsEnum(ComplaintStatus)
  @IsOptional()
  status?: ComplaintStatus;

  @IsString()
  @IsOptional()
  reviewerId?: string;
}