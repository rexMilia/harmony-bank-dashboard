import { apiClient, setTokens, clearTokens } from './api';

interface LoginResponse {
  access: string;
  refresh: string;
}

export interface UserProfile {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string | null;
  id_number_type: string;
  id_number: string | null;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient<LoginResponse>('/accounts/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setTokens(response);
    return response;
  },

  async getProfile(): Promise<UserProfile> {
    return apiClient<UserProfile>('/accounts/me/');
  },

  logout(): void {
    clearTokens();
  },
};
