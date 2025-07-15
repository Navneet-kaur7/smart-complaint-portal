export enum UserRole {
  CONSUMER = 'CONSUMER',
  REVIEWER = 'REVIEWER'
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
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