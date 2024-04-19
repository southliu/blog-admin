import type { FormList } from "#/form";
import type { TFunction } from "i18next";
import type { TableColumn, TableOptions } from '#/public';
import { FORM_REQUIRED } from '@/utils/config';
import { MENU_STATUS } from '@/utils/constants';
import { valueToLabel } from "@/utils/helper";

// 搜索数据
export const searchList = (t: TFunction): FormList[] => [
  {
    label: t('system.state'),
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
      title: t('system.state'),
      dataIndex: 'status',
      width: 200,
      render: (value: number) => (
        <span>{ valueToLabel(value, MENU_STATUS) }</span>
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
    label: t('public.name'),
    name: 'name',
    rules: FORM_REQUIRED,
    component: 'Input'
  },
  {
    label: t('system.state'),
    name: 'status',
    rules: FORM_REQUIRED,
    component: 'Select',
    componentProps: {
      options: MENU_STATUS
    }
  },
];