import { request } from '@/utils/request';

import { adminInfo, adminList, getAdminListQuery, UpdateAdminInfo } from './adminModels';

export function getAdminList(query: getAdminListQuery) {
  return request.get<adminList>({
    url: '/admins',
    params: query,
  });
}

export function getAdminInfo(userId: String) {
  return request.get<adminInfo>({
    url: `/admins/${userId}`,
  });
}

export function createAdmin(data: adminInfo) {
  return request.post({
    url: `/admins`,
    data,
  });
}
export function updateAdmin(userId: String, data: UpdateAdminInfo) {
  return request.put({
    url: `/admins/${userId}`,
    data,
  });
}

export function blockAdmin(userId: String, blocked: Boolean) {
  return request.patch({
    url: `/admins/${userId}`,
    data: { blocked },
  });
}

export function deleteAdmin(userId: String) {
  return request.delete({
    url: `/admins/${userId}`,
  });
}
