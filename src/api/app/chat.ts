import { request } from '@/utils/request';

export function getUserToken(userId: string) {
  return request.get({
    url: `/dev/auth/${userId}`,
  });
}
