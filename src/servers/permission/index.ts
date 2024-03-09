import type { LoginResult } from '@/pages/login/model';
import { request } from '@/servers/request';

/**
 * 权限
 * @param data - 请求数据
 */
export function getPermissions(data?: unknown) {
  return request.get<LoginResult>(
    '/refresh',
    { params: data }
  );
}
