import type { LoginData, LoginResult } from '@/pages/login/model';
import type { RegisterCodeData, RegisterData } from '@/pages/register/model';
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
 * 获取注册码
 * @param data - 请求数据
 */
export function getRegisterCode(data: RegisterCodeData) {
  return request.get('/register-captcha', { params: data });
}

/**
 * 注册
 * @param data - 请求数据
 */
export function register(data: RegisterData) {
  return request.post('/register', data);
}
