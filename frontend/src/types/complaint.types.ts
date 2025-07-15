import { User } from "./user.types";

export enum ComplaintStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

export interface Complaint {
  id: number;
  title: string;
  description: string;
  status: ComplaintStatus;
  consumerId: number;
  consumer?: User;
  comments?: Comment[];
  createdAt: string;
  updated_at: string;
}

export interface CreateComplaintDto {
  title: string;
  description: string;
}

export interface UpdateComplaintDto {
  status: ComplaintStatus;
}

export interface Comment {
  id: number;
  content: string;
  complaint_id: number;
  user_id: number;
  user?: User;
  createdAt: string;
  updated_at: string;
}

export interface CreateCommentDto {
  content: string;
  complaint_id: number;
}
