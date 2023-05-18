import { request } from '@/utils/request';

import { getUserListQuery, UpdateUserInfo, userInfo, userList } from './models/userModels';

export function getUserList(query: getUserListQuery) {
  return request.get<userList>({
    url: '/users',
    params: query,
  });
}

export function getUserInfo(userId: String) {
  return request.get<userInfo>({
    url: `/users/${userId}`,
  });
}

export function createUser(data: userInfo) {
  return request.post({
    url: `/users`,
    data,
  });
}
export function updateUser(userId: String, data: UpdateUserInfo) {
  return request.put({
    url: `/users/${userId}`,
    data,
  });
}

export function blockUser(userId: String, blocked: Boolean) {
  return request.patch({
    url: `/users/${userId}`,
    data: { blocked },
  });
}

export function deleteUser(userId: String) {
  return request.delete({
    url: `/users/${userId}`,
  });
}
