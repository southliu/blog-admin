import type { FormList } from "#/form";
import type { TableColumnsProps } from "#/public";
import type { DefaultOptionType } from 'ant-design-vue/lib/select';
import { FORM_REQUIRED } from "@/utils/config";
import { MENU_TYPE } from "@/utils/constants";

export interface SystemMenuTree {
  children?: SystemMenuTree[];
  id: string;
  type: number;
  link?: boolean;
  name: string;
  route: string;
  parentId?: string;
  permission: string;
  sortNum?: number;
  enable?: boolean;
}

// 权限前缀
const permissionPrefix = '/system/menu';

// 权限
export const pagePermission = {
  page: `${permissionPrefix}/index`,
  create: `${permissionPrefix}/create`,
  update: `${permissionPrefix}/update`,
  delete: `${permissionPrefix}/delete`,
};

// 搜索数据
export const searchList: FormList[] = [
  {
    label: '菜单名称',
    name: 'menuName',
    component: 'Input'
  }
];

// 表格数据
export const tableColumns: TableColumnsProps[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 150
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 100
  },
  {
    title: '接口权限',
    dataIndex: 'permission',
    width: 180
  },
  {
    title: '菜单路由',
    dataIndex: 'route',
    width: 180
  },
  {
    title: '菜单类型',
    dataIndex: 'type',
    echoArr: MENU_TYPE,
    width: 100
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 180
  },
  {
    title: '排序',
    dataIndex: 'sortNum',
    width: 80
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 320,
    fixed: 'right',
    ellipsis: false,
  }
];

// 新增数据
export const createList = (parentList: DefaultOptionType[], type = 0): FormList[] => [
  {
    label: '名称',
    name: 'name',
    rules: FORM_REQUIRED,
    component: 'Input',
    componentProps: {
      maxlength: 60,
    }
  },
  {
    label: '接口权限',
    name: 'permission',
    rules: FORM_REQUIRED,
    component: 'Input',
    componentProps: {
      maxlength: 60,
    }
  },
  {
    label: '菜单类型',
    name: 'type',
    rules: FORM_REQUIRED,
    component: 'Select',
    componentProps: {
      options: MENU_TYPE
    }
  },
  {
    label: '菜单路由',
    name: 'route',
    rules: FORM_REQUIRED,
    hidden: type !== 1,
    component: 'Input'
  },
  {
    label: '排序',
    name: 'sortNum',
    rules: FORM_REQUIRED,
    component: 'InputNumber',
    componentProps: {
      max: 99,
    }
  },
  {
    label: '父级菜单',
    name: 'parentId',
    component: 'TreeSelect',
    componentProps: {
      treeData: parentList,
      fieldNames: {
        label: 'menuName',
        value: 'id'
      }
    }
  },
];