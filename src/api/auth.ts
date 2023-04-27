interface TokenResponse {
  token: string;
  token_type: string;
}
import { request } from '@/utils/request';

export function loginAdmin(data: { username: string; password: string }) {
  return request.post<TokenResponse>({
    url: '/auth',
    data,
  });
}

export function getUserRole(data: { token: string }) {
  return request.get({
    url: '/auth',
    data,
  });
}
