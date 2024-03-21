import type { FormList } from "#/form";
import type { TableColumnsProps } from "#/public";
import { FORM_REQUIRED } from "@/utils/config";

// 权限前缀
const permissionPrefix = '/system/role';

// 权限
export const pagePermission = {
  page: `${permissionPrefix}/index`,
  create: `${permissionPrefix}/create`,
  update: `${permissionPrefix}/update`,
  delete: `${permissionPrefix}/delete`,
  permission: `${permissionPrefix}/authority`
};

// 搜索数据
export const searchList: FormList[] = [
  {
    label: '名称',
    name: 'name',
    component: 'Input',
    componentProps: {
      maxlength: 30
    }
  },
];

// 表格数据
export const tableColumns: TableColumnsProps[] = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 160,
    ellipsis: false,
  },
];

// 新增数据
export const createList: FormList[] = [
  {
    label: '名称',
    name: 'name',
    rules: FORM_REQUIRED,
    component: 'Input',
    componentProps: {
      maxlength: 32
    }
  },
];