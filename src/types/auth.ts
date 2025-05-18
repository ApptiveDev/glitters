export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  birth: string;
  gender: number;
  termsAccepted: boolean;
  joinedAt: string;
  reportedCount: number;
  isDeactivated: boolean;
  institution: {
    id: number;
    name: string;
    emailDomain: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
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
