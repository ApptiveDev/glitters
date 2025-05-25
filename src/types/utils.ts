export interface SchoolListType {
  id: number;
  name: string;
  emailDomain: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolListResponse {
  institutions: SchoolListType[];
}

export interface InputField {
  value: string;
  isValid: boolean;
  isTouched: boolean;
}
