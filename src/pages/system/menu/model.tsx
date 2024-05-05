import type { FormList } from "#/form";
import type { TFunction } from "i18next";
import type { TableColumn, TableOptions } from '#/public';
import { FORM_REQUIRED, EMPTY_VALUE } from '@/utils/config';
import { MENU_STATUS, MENU_TYPES } from '@/utils/constants';
import { valueToLabel } from "@/utils/helper";

// 搜索数据
export const searchList = (t: TFunction): FormList[] => [
  {
    label: t('public.state'),
    name: 'status',
    wrapperCol: 100,
    component: 'Select',
    componentProps: {
      options: MENU_STATUS
    }
  },
  {
    label: t('public.name'),
    name: 'label',
    component: 'Input',
    componentProps: {
      maxLength: 200
    }
  },
  {
    label: t('public.type'),
    name: 'type',
    wrapperCol: 100,
    component: 'Select',
    componentProps: {
      options: MENU_TYPES
    }
  },
];

/**
 * 表格数据
 * @param optionRender - 渲染操作函数
 */
export const tableColumns = (t: TFunction, optionRender: TableOptions<object>): TableColumn => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200
    },
    {
      title: t('public.name'),
      dataIndex: 'label',
      width: 200
    },
    {
      title: t('system.englishName'),
      dataIndex: 'labelEn',
      width: 200
    },
    {
      title: t('public.state'),
      dataIndex: 'enable',
      width: 150,
      render: (value: number) => (
        <span>{ valueToLabel(value, MENU_STATUS) || EMPTY_VALUE }</span>
      )
    },
    {
      title: t('public.type'),
      dataIndex: 'type',
      width: 150,
      render: (value: number) => (
        <span>{ valueToLabel(value, MENU_TYPES) || EMPTY_VALUE }</span>
      )
    },
    {
      title: t('public.creationTime'),
      dataIndex: 'createdAt',
      width: 200
    },
    {
      title: t('public.updateTime'),
      dataIndex: 'updatedAt',
      width: 200
    },
    {
      title: t('public.operate'),
      dataIndex: 'operate',
      width: 200,
      fixed: 'right',
      render: (value: unknown, record: object) => optionRender(value, record)
    },
  ];
};

// 新增数据
export const createList = (t: TFunction, id: string): FormList[] => [
  {
    label: t('system.parentId'),
    name: 'parentId',
    rules: FORM_REQUIRED,
    component: 'Input'
  },
  {
    label: t('public.name'),
    name: 'label',
    rules: FORM_REQUIRED,
    component: 'Input'
  },
  {
    label: t('public.name'),
    name: 'labelEn',
    component: 'Input'
  },
  {
    label: t('public.state'),
    name: 'type',
    rules: FORM_REQUIRED,
    component: 'Select',
    componentProps: {
      options: MENU_STATUS
    }
  },
];