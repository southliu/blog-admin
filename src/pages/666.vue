<template>
  <BasicContent :isPermission="checkPermission(pagePermission.page)">
    <BasicForm
      ref="createFormRef"
      :list="list"
      :labelCol="{ style: { width: '100px' }}"
      :data="data"
      @handleFinish="handleSubmit"
    />

    <BasicBtn
      class="w-120px ml-100px"
      type="primary"
      :isLoading="isLoading"
      @click="handleClick"
    >
      提交
    </BasicBtn>
  </BasicContent>
</template>

<script lang="ts" setup>
import type { FormList } from '#/form';
import type { BasicFormProps } from '@/components/Form/model';
import { ref, shallowRef } from 'vue';
import { BasicBtn } from '@/components/Buttons';
import { checkPermission } from '@/utils/permissions';
import { FORM_REQUIRED } from '@/utils/config';
import { message } from 'ant-design-vue';
import { createSystemMenu } from '@/servers/systems/menu';
import { pagePermission } from './systems/menu/model';
import BasicForm from '@/components/Form/BasicForm.vue';

interface Data {
  name?: string;
  parentId?: string;
  permissions?: string;
}

const createFormRef = shallowRef<BasicFormProps>();
const isLoading = ref(false);
const data = ref<Data>({});

const list: FormList[] = [
  {
    label: '菜单名',
    name: 'name',
    rules: FORM_REQUIRED,
    component: 'Input',
    componentProps: {
      maxlength: 60,
    }
  },
  {
    label: '父级菜单ID',
    name: 'parentId',
    rules: FORM_REQUIRED,
    component: 'Input',
    componentProps: {
      maxlength: 60,
    }
  },
  {
    label: '接口权限',
    name: 'permissions',
    rules: FORM_REQUIRED,
    component: 'Input',
    componentProps: {
      maxlength: 60,
    }
  },
];

const createList = [
  { label: '查看', value: 'index' },
  { label: '新增', value: 'create' },
  { label: '编辑', value: 'update' },
  { label: '删除', value: 'delete' },
];

const handleClick = () => {
  createFormRef.value?.handleSubmit();
};

const handleSubmit = async () => {
  let num = 0;
  const errorArr: string[] = [], successArr: string[] = [];
  const params = {
    parentId: data.value.parentId,
    type: 2,
    name: '',
    permission: '',
    sortNum: 1,
  };

  isLoading.value = true;
  for (let i = 0; i < createList.length; i++) {
    const item = createList[i];
    const permissions = `${data.value.permissions}/${item.value}`;
    params.permission = permissions;
    params.name = `${data.value.name}-${item.label}`;
    params.sortNum = i + 1;

    createSystemMenu(params).then(res => {
      const { code } = res;
      if (Number(code) !== 200) {
        return errorArr.push(item.label);
      }

      successArr.push(item.label);
    }).finally(() => {
      num++;
      if (num < 4) return;
      isLoading.value = false;

      if (errorArr?.length === 0) {
        // data.value = {};
        return message.success('增删改查执行成功');
      }

      successArr.length && message.success({
        content: `执行成功：${successArr.join('、')}`,
        duration: 5
      });

      errorArr.length && message.error({
        content: `执行失败：${errorArr.join('、')}`,
        duration: 5
      });
    });
  }
};
</script>