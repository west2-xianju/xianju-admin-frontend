import { request } from '@/utils/request';

import { getOrderListQuery, OrderList } from './models/orderModels';

export function getOrderList(query: getOrderListQuery) {
  return request.get<OrderList>({
    url: '/orders',
    params: query,
  });
}

export function getOrderStats() {
  return request.get({
    url: '/orders/stats',
  });
}
