import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content?: string;
}
