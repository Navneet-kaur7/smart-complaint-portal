import { ComplaintStatus } from '@prisma/client';

export class ComplaintResponseDto {
  id: number;
  title: string;
  description: string;
  status: ComplaintStatus;
  consumerId: string;
  reviewerId?: string;
  createdAt: Date;
  updatedAt: Date;
  consumer?: {
    id: string;
    fullName: string;
    email: string;
  };
  reviewer?: {
    id: string;
    fullName: string;
    email: string;
  };
  _count?: {
    comments: number;
  };
}