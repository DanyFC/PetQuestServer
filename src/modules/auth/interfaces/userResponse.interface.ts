export interface UserResponse {
  id?: string;
  userName: string;
  email: string;
  phone: string;
  createdAt: Date;
  published: string[];
  commented: string[];
  isActive: boolean;
}
