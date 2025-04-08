export interface SchoolListType {
  id: number;
  name: string;
  emailDomain: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SchoolListResponse {
  institutions: SchoolListType[];
}
