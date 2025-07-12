import { UserRole } from '@prisma/client';

export class UserResponseDto {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}