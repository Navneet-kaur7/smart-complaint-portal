import { IsNotEmpty, IsString, IsInt, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;

  @IsNotEmpty()
  @IsInt()
  complaintId: number;
}