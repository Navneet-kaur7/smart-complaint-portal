export enum UserRole {
  CONSUMER = 'CONSUMER',
  REVIEWER = 'REVIEWER'
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}