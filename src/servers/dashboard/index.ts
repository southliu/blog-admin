import type { DashboardResult } from '@/pages/systems/dashboard/model';
import { request } from '@/servers/request';

/**
 * 获取数据总览数据
 * @param data - 请求数据
 */
export function getDataTrends(data: object) {
  return request.get<DashboardResult>(
    '/dashboard',
    { params: data }
  );
}
