import type { FormData } from '#/form';
import type { PagePermission } from '#/public';
import { useEffect, useRef, useState } from 'react';
import { searchList, createList, tableColumns, type APIMethodData } from './model';
import { type FormInstance, Button, Col, Form, Input, Row, Select, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { checkPermission } from '@/utils/permissions';
import { useCommonStore } from '@/hooks/useCommonStore';
import { ADD_TITLE, EDIT_TITLE } from '@/utils/config';
import { getComponent } from '@/components/Form/utils/componentMap';
import { BasicBtn, UpdateBtn, DeleteBtn } from '@/components/Buttons';
import {
  getMenuList,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu
} from '@/servers/system/menu';
import BasicContent from '@/components/Content/BasicContent';
import BasicSearch from '@/components/Search/BasicSearch';
import BasicModal from '@/components/Modal/BasicModal';
import BasicTable from '@/components/Table/BasicTable';
import { filterFormItem, handleValuePropName } from '@/components/Form/utils/helper';
import { Icon } from '@iconify/react';
import { API_METHODS } from '@/utils/constants';
import { useFiler } from '@/components/TableFilter/hooks/useFiler';
import FilterButton from '@/components/TableFilter';

// 当前行数据
interface RowData {
  id: string;
}

// 初始化搜索数据
const initSearch = {
};

// 初始化新增数据
const initCreate = {
  sortNum: 1,
};

function Page() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const columns = tableColumns(t, optionRender);
  const createFormRef = useRef<FormInstance>(null);
  const [isFetch, setFetch] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isCreateLoading, setCreateLoading] = useState(false);
  const [createTitle, setCreateTitle] = useState(ADD_TITLE(t));
  const [createId, setCreateId] = useState('');
  const [createData, setCreateData] = useState<FormData>(initCreate);
  const [searchData, setSearchData] = useState<FormData>({});
  const [tableData, setTableData] = useState<FormData[]>([]);
  const [apiMethods, setApiMethods] = useState<APIMethodData[]>([{}]);
  const [tableFilters, setTableFilters] = useState<string[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [handleFilterTable] = useFiler();
  const { permissions } = useCommonStore();

  // 权限前缀
  const permissionPrefix = '/system/menu';

  // 权限
  const pagePermission: PagePermission = {
    page: checkPermission(`${permissionPrefix}/search`, permissions),
    create: checkPermission(`${permissionPrefix}/create`, permissions),
    update: checkPermission(`${permissionPrefix}/update`, permissions),
    delete: checkPermission(`${permissionPrefix}/delete`, permissions)
  };

  useEffect(() => {
    if (isFetch) getPage();
  }, [isFetch])

  useEffect(() => {
    form?.setFieldsValue?.(createData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createData]);

  // 首次进入自动加载接口数据
  useEffect(() => {
    if (pagePermission.page) getPage();
  }, [pagePermission.page]);

  /**
   * 获取勾选表格数据
   * @param checks - 勾选
   */
  const getTableChecks = (checks: string[]) => {
    setTableFilters(checks);
  };

  /**
   * 点击搜索
   * @param values - 表单返回数据
   */
  const onSearch = (values: FormData) => {
    setSearchData(values);
    setFetch(true);
  };

  /**
   * 点击新增
   * @param id
   */
  const onCreate = (id?: string) => {
    setCreateOpen(true);
    setCreateTitle(ADD_TITLE(t));
    setCreateId('');
    setCreateData({ ...initCreate, parentId: id });
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
      const { code, data } = await getMenuById(id as string);
      if (Number(code) !== 200) return;
      setCreateData(data);
    } finally {
      setCreateLoading(false);
    }
  };

  /** 回车处理 */
  const onPressEnter = () => {
    form?.submit();
  };

  /** 表单提交 */
  const createSubmit = () => {
    createFormRef.current?.submit();
  };

  /** 关闭新增/修改弹窗 */
  const closeCreate = () => {
    setCreateOpen(false);
    setApiMethods([{}]);
  };

  /** 获取表格数据 */
  const getPage = async () => {
    const params = { ...searchData, isAll: true };

    try {
      setLoading(true);
      const res = await getMenuList(params);
      const { code, data } = res;
      if (Number(code) !== 200) return;
      setTableData(data as unknown as FormData[]);
    } finally {
      setFetch(false);
      setLoading(false);
    }
  };

  /**
   * 新增/编辑提交
   * @param values - 表单返回数据
   */
  const handleCreate = async (values: FormData) => {
    try {
      const params: FormData = {
        ...values,
        apiMethods
      };

      setCreateLoading(true);
      const functions = () => createId ? updateMenu(createId, params) : createMenu(params);
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
      const { code, message } = await deleteMenu(id as string);
      if (Number(code) === 200) {
        messageApi.success(message || t('public.successfullyDeleted'));
        getPage();
      }
    } finally {
      setLoading(false);
    }
  };

  /** 添加api方法 */
  const handleAddApiMethod = () => {
    const newApiMethod: APIMethodData[] = JSON.parse(JSON.stringify(apiMethods));
    newApiMethod?.push({});
    setApiMethods(newApiMethod);
  };

  /**
   * 删除api方法
   * @param index - 下标
   */
  const handleDeleteApiMethod = (index: number) => {
    const newApiMethod: APIMethodData[] = JSON.parse(JSON.stringify(apiMethods));
    newApiMethod?.splice(index, 1);
    setApiMethods(newApiMethod);
  };

  /**
   * 修改api方法
   * @param value - 值
   * @param index - 下标
   * @param type - 类型
   */
  const handleChangeItemApi = (value: string, index: number, type: 'method' | 'path') => {
    const newApiMethod: APIMethodData[] = JSON.parse(JSON.stringify(apiMethods));
    newApiMethod[index][type] = value;
    setApiMethods(newApiMethod);
  };

  /**
   * 渲染操作
   * @param _ - 当前值
   * @param record - 当前行参数
   */
  function optionRender(_: unknown, record: object) {
    return <>
      {
        pagePermission.create === true &&
        <BasicBtn
          className='mr-5px'
          isLoading={isLoading}
          onClick={() => onCreate((record as RowData).id)}
        >
          { t('system.addTreeChildren') }
        </BasicBtn>
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
    </>;
  }

  return (
    <BasicContent isPermission={pagePermission.page}>
      <>
        { contextHolder }
        <BasicSearch
          list={searchList(t)}
          data={initSearch}
          isLoading={isLoading}
          isCreate={pagePermission.create}
          onCreate={onCreate}
          handleFinish={onSearch}
        >
          <FilterButton
            columns={columns}
            className='!mb-5px'
            getTableChecks={getTableChecks}
          />
        </BasicSearch>

        <BasicTable
          loading={isLoading}
          columns={handleFilterTable(columns, tableFilters)}
          dataSource={tableData}
        />

        <BasicModal
          width={800}
          title={createTitle}
          open={isCreateOpen}
          confirmLoading={isCreateLoading}
          onOk={createSubmit}
          onCancel={closeCreate}
        >
          <Form
            form={form}
            labelCol={{ span: 4 }}
            onFinish={handleCreate}
          >
            <Row gutter={24}>
              {
                createList(t)?.map(item => (
                  <Col span={12} key={String(item.name)}>
                    <Form.Item
                      {...filterFormItem(item)}
                      key={`${item.name}`}
                      label={item.label}
                      name={item.name}
                      rules={!item.hidden ? item.rules : []}
                      className={item.hidden ? '!hidden' : ''}
                      valuePropName={handleValuePropName(item.component)}
                    >
                      { getComponent(t, item, onPressEnter) }
                    </Form.Item>
                  </Col>
                ))
              }
            </Row>
            <div className='font-bold'>API接口权限：</div>
            <Row className='mb-5px'>
              <Col flex='150px' className='font-bold mr-10px'>
                方法
              </Col>
              <Col flex={8} className='font-bold'>
                路径
              </Col>
            </Row>
            {
              apiMethods?.map((item, index) => (
                <Row key={index} className='mb-15px'>
                  <Col flex='150px' className='mr-10px'>
                    <Select
                      value={item.method}
                      className='w-150px'
                      placeholder={t('public.inputPleaseSelect')}
                      options={API_METHODS}
                      onChange={value => handleChangeItemApi(value, index, 'method')}
                    />
                  </Col>
                  <Col flex={8}>
                    <Input
                      value={item.path}
                      placeholder={t('public.inputPleaseEnter')}
                      onChange={e => handleChangeItemApi(e.target.value, index, 'path')}
                    />
                  </Col>
                  <Col flex={1}>
                    <div
                      className='h-full flex items-center justify-center cursor-pointer'
                      onClick={() => handleDeleteApiMethod(index)}
                    >
                      <Icon
                        icon='material-symbols:delete-outline'
                        className='text-18px'
                      />
                    </div>
                  </Col>
                </Row>
              ))
            }
            <Button
              className='w-full mt-5px'
              type="dashed"
              block
              onClick={handleAddApiMethod}
            >
              <Icon icon='material-symbols:add' />
              <span>新增</span>
            </Button>
          </Form>
        </BasicModal>
      </>
    </BasicContent>
  );
}

export default Page;
