import type { FormData } from '#/form';
import type { PagePermission, TableOptions } from '#/public';
import type { FormFn } from '@/components/Form/BasicForm';
import { useCallback, useEffect, useRef, useState } from 'react';
import { searchList, createList, tableColumns } from './model';
import { Button, Col, Form, Row, message } from 'antd';
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
  const searchFormRef = useRef<FormFn>(null);
  const createFormRef = useRef<FormFn>(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isCreateLoading, setCreateLoading] = useState(false);
  const [createTitle, setCreateTitle] = useState(ADD_TITLE(t));
  const [createId, setCreateId] = useState('');
  const [createData, setCreateData] = useState<FormData>(initCreate);
  const [tableData, setTableData] = useState<FormData[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { permissions } = useCommonStore();

  useEffect(() => {
    form.setFieldsValue(createData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createData]);

  // 权限前缀
  const permissionPrefix = '/system/menu';

  // 权限
  const pagePermission: PagePermission = {
    page: checkPermission(`${permissionPrefix}/search`, permissions),
    create: checkPermission(`${permissionPrefix}/create`, permissions),
    update: checkPermission(`${permissionPrefix}/update`, permissions),
    delete: checkPermission(`${permissionPrefix}/delete`, permissions)
  };

  /**
   * 点击搜索
   * @param values - 表单返回数据
   */
  const onSearch = (values: FormData) => {
    handleSearch(values);
  };

  /**
   * 处理搜索
   * @param values - 表单返回数据
   */
  const handleSearch = useCallback(async (values: FormData) => {
    try {
      setLoading(true);
      const res = await getMenuList({...values, isAll: true});
      const { code, data } = res;
      if (Number(code) !== 200) return;
      setTableData(data as unknown as FormData[]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 首次进入自动加载接口数据
  useEffect(() => { 
    if (pagePermission.page) handleSearch({ ...initSearch });
  }, [handleSearch, pagePermission.page]);

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

  /** 表单提交 */
  const createSubmit = () => {
    createFormRef.current?.handleSubmit();
  };

  /** 关闭新增/修改弹窗 */
  const closeCreate = () => {
    setCreateOpen(false);
  };

  /** 获取表格数据 */
  const getPage = () => {
    const formData = searchFormRef.current?.getFieldsValue() || {};
    const params = { ...formData };
    handleSearch(params);
  };

  /**
   * 新增/编辑提交
   * @param values - 表单返回数据
   */
  const handleCreate = async (values: FormData) => {
    try {
      setCreateLoading(true);
      const functions = () => createId ? updateMenu(createId, values) : createMenu(values);
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

  /**
   * 渲染操作
   * @param _ - 当前值
   * @param record - 当前行参数
   */
  const optionRender: TableOptions<object> = (_, record) => (
    <>
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
    </>
  );

  return (
    <BasicContent isPermission={pagePermission.page}>
      <>
        { contextHolder }
        <BasicSearch
          formRef={searchFormRef}
          list={searchList(t)}
          data={initSearch}
          isLoading={isLoading}
          isCreate={pagePermission.create}
          onCreate={onCreate}
          handleFinish={onSearch}
        />
        
        <BasicTable
          loading={isLoading}
          columns={tableColumns(t, optionRender)}
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
                      { getComponent(t, item) }
                    </Form.Item>
                  </Col>
                ))
              }
            </Row>
            <div className='font-bold'>API接口权限：</div>
            <Row gutter={24}>
              {
                ['', '', ''].map((item, index) => (
                  <div key={index} className='w-full flex flex-wrap'>
                    <Col span={12}>
                      left
                    </Col>
                    <Col span={12}>
                      right
                    </Col>
                  </div>
                ))
              }
            </Row>
            <Button
              className='w-full mt-5px'
              type="dashed"
              block
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