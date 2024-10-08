import type { FormData } from '#/form';
import type { DataNode } from 'antd/es/tree';
import type { Key } from 'antd/es/table/interface';
import type { PagePermission, TableOptions } from '#/public';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createList, searchList, tableColumns } from './model';
import { type FormInstance, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { checkPermission } from '@/utils/permissions';
import { useCommonStore } from '@/hooks/useCommonStore';
import { ADD_TITLE, EDIT_TITLE } from '@/utils/config';
import { UpdateBtn, DeleteBtn } from '@/components/Buttons';
import { getPermission, savePermission } from '@/servers/system/menu';
import {
  createUser,
  deleteUser,
  getUserById,
  getUserPage,
  updateUser
} from '@/servers/system/user';
import BaseContent from '@/components/Content/BaseContent';
import BaseSearch from '@/components/Search/BaseSearch';
import BaseModal from '@/components/Modal/BaseModal';
import BaseForm from '@/components/Form/BaseForm';
import BaseTable from '@/components/Table/BaseTable';
import BasePagination from '@/components/Pagination/BasePagination';
import PermissionDrawer from './components/PermissionDrawer';

// 当前行数据
interface RowData {
  id: string;
}

// 初始化搜索
const initSearch = {
  page: 1,
  pageSize: 20
};

// 初始化新增数据
const initCreate = {
  status: 1
};

function Page() {
  const { t } = useTranslation();
  const createFormRef = useRef<FormInstance>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isFetch, setFetch] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isCreateLoading, setCreateLoading] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState(ADD_TITLE(t));
  const [createId, setCreateId] = useState('');
  const [createData, setCreateData] = useState<FormData>(initCreate);
  const [searchData, setSearchData] = useState<FormData>({});
  const [page, setPage] = useState(initSearch.page);
  const [pageSize, setPageSize] = useState(initSearch.pageSize);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState<FormData[]>([]);

  const [promiseId, setPromiseId] = useState('');
  const [isPromiseVisible, setPromiseVisible] = useState(false);
  const [promiseCheckedKeys, setPromiseCheckedKeys] = useState<Key[]>([]);
  const [promiseTreeData, setPromiseTreeData] = useState<DataNode[]>([]);

  const { permissions } = useCommonStore();

  // 权限前缀
  const permissionPrefix = '/system/user';

  // 权限
  const pagePermission: PagePermission = {
    page: checkPermission(`${permissionPrefix}/search`, permissions),
    create: checkPermission(`${permissionPrefix}/create`, permissions),
    update: checkPermission(`${permissionPrefix}/update`, permissions),
    delete: checkPermission(`${permissionPrefix}/delete`, permissions),
    permission: checkPermission(`${permissionPrefix}/systems`, permissions)
  };

  /** 获取表格数据 */
  const getPage = useCallback(async () => {
    const params = { ...searchData, page, pageSize };

    try {
      setLoading(true);
      const { code, data } = await getUserPage(params);
      if (Number(code) !== 200) return;
      const { items, total } = data;
      setTotal(total);
      setTableData(items);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchData]);

  useEffect(() => {
    if (isFetch) getPage();
  }, [getPage, isFetch]);

  // 首次进入自动加载接口数据
  useEffect(() => {
    if (pagePermission.page) getPage();
  }, [getPage, pagePermission.page]);

  /**
   * 点击搜索
   * @param values - 表单返回数据
   */
  const onSearch = (values: FormData) => {
    setPage(1);
    setSearchData(values);
    setFetch(true);
  };

  /** 开启权限 */
  const openPermission = async (id: string) => {
    try {
      setLoading(true);
      const params = { userId: id };
      const { code, data } = await getPermission(params);
      if (Number(code) !== 200) return;
      const { defaultCheckedKeys, treeData } = data;
      setPromiseId(id);
      setPromiseTreeData(treeData);
      setPromiseCheckedKeys(defaultCheckedKeys);
      setPromiseVisible(true);
    } finally {
      setLoading(false);
    }
  };

  /** 关闭权限 */
  const closePermission = () => {
    setPromiseVisible(false);
  };

  /**
   * 权限提交
   */
  const permissionSubmit = async (checked: Key[]) => {
    try {
      setLoading(true);
      const params = {
        menuIds: checked,
        userId: promiseId
      };
      const { code, message } = await savePermission(params);
      if (Number(code) !== 200) return;
      messageApi.success(message || t('system.authorizationSuccessful'));
      setPromiseVisible(false);
    } finally {
      setLoading(false);
    }
  };

  /** 点击新增 */
  const onCreate = () => {
    setCreateOpen(true);
    setCreateTitle(ADD_TITLE(t));
    setCreateId('');
    setCreateData(initCreate);
  };

  /**
   * 点击编辑
   * @param id - 唯一值
   */
  const onUpdate = async (id: string) => {
    try {
      setCreateOpen(true);
      setCreateTitle(EDIT_TITLE(t, id));
      setCreateId(id);
      setCreateLoading(true);
      const { code, data } = await getUserById(id as string);
      if (Number(code) !== 200) return;
      setCreateData(data);
    } finally {
      setCreateLoading(false);
    }
  };

  /** 表格提交 */
  const createSubmit = () => {
    createFormRef.current?.submit();
  };

  /** 关闭新增/修改弹窗 */
  const closeCreate = () => {
    setCreateOpen(false);
  };

  /**
   * 新增/编辑提交
   * @param values - 表单返回数据
   */
  const handleCreate = async (values: FormData) => {
    try {
      setCreateLoading(true);
      const functions = () => createId ? updateUser(createId, values) : createUser(values);
      const { code, message } = await functions();
      if (Number(code) !== 200) return;
      messageApi.success(message || t('public.successfulOperation'));
      setCreateOpen(false);
      getPage();
    } finally {
      setCreateLoading(false);
    }
  };

  /**
   * 点击删除
   * @param id - 唯一值
   */
  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      const { code, message } = await deleteUser(id as string);
      if (Number(code) === 200) {
        messageApi.success(message || t('public.successfullyDeleted'));
        getPage();
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理分页
   * @param page - 当前页数
   * @param pageSize - 每页条数
   */
  const onChangePagination = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
    setFetch(true);
  };

  /**
   * 渲染操作
   * @param _ - 当前值
   * @param record - 当前行参数
   */
  const optionRender: TableOptions<object> = (_, record) => (
    <>
      {
        pagePermission.permission === true &&
        <Button
          className='mr-2'
          loading={isLoading}
          onClick={() => openPermission((record as RowData).id)}
        >
          { t('system.permissions') }
        </Button>
      }
      {
        pagePermission.update === true &&
        <UpdateBtn
          className='mr-5px'
          isLoading={isLoading}
          onClick={() => onUpdate((record as RowData).id)}
        />
      }
      {
        pagePermission.delete === true &&
        <DeleteBtn
          className='mr-5px'
          isLoading={isLoading}
          handleDelete={() => onDelete((record as RowData).id)}
        />
      }
    </>
  );

  return (
    <BaseContent isPermission={pagePermission.page}>
      { contextHolder }
      <BaseSearch
        list={searchList(t)}
        data={initSearch}
        isLoading={isLoading}
        handleFinish={onSearch}
      />

      <BaseTable
        isLoading={isLoading}
        isCreate={pagePermission.create}
        columns={tableColumns(t, optionRender)}
        dataSource={tableData}
        getPage={getPage}
        onCreate={onCreate}
      />

      <BasePagination
        disabled={isLoading}
        current={page}
        pageSize={pageSize}
        total={total}
        onChange={onChangePagination}
      />

      <BaseModal
        title={createTitle}
        open={isCreateOpen}
        confirmLoading={isCreateLoading}
        onOk={createSubmit}
        onCancel={closeCreate}
      >
        <BaseForm
          ref={createFormRef}
          list={createList(t)}
          data={createData}
          labelCol={{ span: 6 }}
          handleFinish={handleCreate}
        />
      </BaseModal>

      <PermissionDrawer
        isVisible={isPromiseVisible}
        treeData={promiseTreeData}
        checkedKeys={promiseCheckedKeys}
        onClose={closePermission}
        onSubmit={permissionSubmit}
      />
    </BaseContent>
  );
}

export default Page;
