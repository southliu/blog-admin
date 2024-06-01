import { DefaultOptionType } from 'antd/es/select';
import { t } from 'i18next';

/**
 * @description: 公用常量
 */

/**
 * 颜色
 */
 export enum colors {
  success = 'green',
  primary = '#409EFF',
  warning = '#E6A23C',
  danger = 'red',
  info = '#909399'
}

export interface Constant extends Omit<DefaultOptionType, 'children'> {
  value: string | number;
  label: string;
  color?: colors;
  children?: Constant[];
}

/**
 * 开启状态
 */
export const OPEN_CLOSE: Constant[] = [
  { label: t('public.open'), value: 1 },
  { label: t('public.close'), value: 0 }
];

/**
 * 菜单状态
 */
export const MENU_STATUS: Constant[] = [
  { label: t('public.enable'), value: 1 },
  { label: t('public.disable'), value: 0 }
];

/**
 * 菜单类型
 */
export const MENU_TYPES: Constant[] = [
  { label: t('system.directory'), value: 0 },
  { label: t('system.menu'), value: 1 },
  { label: t('system.button'), value: 2 },
];

/**
 * API方法
 */
export const API_METHODS: Constant[] = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'PATCH', value: 'PATCH' },
  { label: 'DELETE', value: 'DELETE' },
];
