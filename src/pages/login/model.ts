// 接口传入数据
export interface LoginData {
  username: string;
  password: string;
}

// 用户数据
interface UserInfo {
  id: number;
  nickName: string;
  phone: string;
  email: string;
}

// 授权数据
export interface PermissionsData {
  id: string;
  operation: string[];
}

// 用户权限数据
interface Roles {
  id: string;
}

// 接口返回数据
export interface LoginResult {
  token: string;
  userInfo: UserInfo;
  permissions: string[];
  roles: Roles[];
}