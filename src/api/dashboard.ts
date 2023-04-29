import { DashboardPanel } from '@/pages/dashboard/base/constants';
import { request } from '@/utils/request';

// return BaseResponse(data={'user_count': user_count,
// 'user_online': user_online,
// 'good_count': good_count,
// 'good_pending': good_pending,
// 'issue_count': issue_count,
// 'sys_start_time': sys_start_time,
// }).dict()
export interface dashboardResponse {
  // user_count: number;
  // user_online: number;
  // good_count: number;
  // good_pending: number;
  // issue_count: number;
  // sys_start_time: string;
  list: Array<DashboardPanel>;
}

export function getDashboard() {
  return request.get<dashboardResponse>({
    url: '/dashboard',
  });
}
