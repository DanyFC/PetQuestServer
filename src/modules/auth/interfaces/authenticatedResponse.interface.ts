import { UserResponse } from './userResponse.interface';

export interface AuthenticatedResponse {
  user: UserResponse;
  token: string;
}
