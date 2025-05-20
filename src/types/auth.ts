import { SchoolListType } from './utils';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  birth: string;
  gender: number;
  isAdmin: boolean;
  termsAccepted: boolean;
  joinedAt: string;
  reportedCount: number;
  isDeactivated: boolean;
  institution: SchoolListType;
  hasUnreadChat: boolean;
}

export interface UserRegistrationRequest {
  email: string;
  password: string;
  name: string;
  birth: string;
  gender: number;
  termsAccepted: boolean;
}

export interface UserRegistrationResponse {
  member: User;
  token: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserInfoResponse {
  member: User;
}
