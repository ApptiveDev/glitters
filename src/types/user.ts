export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  birth: string;
  termsAccepted: boolean;
  joinedAt: string;
  reportedCount: number;
  isDeactivated: boolean;
}

export interface SignUpUser {
  email?: string;
  password?: string;
  name?: string;
  birth?: string;
  termsAccepted?: boolean;
}

export interface SignUpUserResponse {
  user: User;
  token: string;
}
