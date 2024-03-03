import type { LoginData, LoginResult } from '@/pages/login/model';
import { RegisterData } from '@/pages/register/model';
import { request } from '@/servers/request';

/**
 * 登录
 * @param data - 请求数据
 */
export function login(data: LoginData) {
  return request.post<LoginResult>('/login', data);
}

/**
 * 修改密码
 * @param data - 请求数据
 */
export function updatePassword(data: unknown) {
  return request.post('/update-password', data);
}

/**
 * 注册
 * @param data - 请求数据
 */
export function getRegisterCode(data: RegisterData) {
  return request.get<LoginResult>('/register-captcha', { params: data });
}
