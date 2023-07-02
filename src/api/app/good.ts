import { request } from '@/utils/request';

import { getGoodListQuery, GoodForm, GoodInfo, GoodList } from './models/goodModels';

export function getGoodList(query: getGoodListQuery) {
  return request.get<GoodList>({
    url: '/goods',
    params: query,
  });
}

export function getGoodInfo(goodId: String) {
  return request.get<GoodInfo>({
    url: `/goods/${goodId}`,
  });
}

export function createGood(data: GoodInfo) {
  return request.post({
    url: `/goods`,
    data,
  });
}
export function updateGood(goodId: String, data: GoodForm) {
  return request.put({
    url: `/goods/${goodId}`,
    data,
  });
}

export function hideGood(goodId: string) {
  return request.patch({
    url: `/goods/${goodId}`,
  });
}

export function censorGood(goodId: string, op: string) {
  return request.patch({
    url: `/goods/${goodId}/censor`,
    data: { op },
  });
}

export function deleteGood(goodId: String) {
  return request.delete({
    url: `/goods/${goodId}`,
  });
}

export function getGoodsStats() {
  return request.get({
    url: '/goods/stats',
  });
}
