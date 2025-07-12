import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateComplaintDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(100, { message: 'Title cannot exceed 100 characters' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description: string;
}