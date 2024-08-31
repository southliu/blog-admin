import { create } from 'zustand';

interface UserInfo {
  id: number;
  username: string;
  email: string;
  phone: string;
}

interface UserState {
  permissions: string[];
  userInfo: UserInfo;
  setPermissions: (permissions: string[]) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  clearInfo: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  permissions: [],
  userInfo: {
    id: 0,
    username: '',
    email: '',
    phone: ''
  },
  /** 设置用户信息 */
  setPermissions: (permissions) => set({ permissions }),
  /** 设置权限 */
  setUserInfo: (userInfo) => set({ userInfo }),
  /** 清除用户信息 */
  clearInfo: () => set({
    userInfo: { id: 0, username: '', email: '', phone: '' }
  })
}));
