import { UserRole } from '@prisma/client';

export class AuthResponseDto {
  access_token: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  };
}