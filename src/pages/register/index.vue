<template>
  <div class="bg-light-400 w-screen h-screen">
    <div class="box w-300px rounded-5px bg-white box-border">
      <div class="px-20px py-15px mb-30px flex items-center justify-between b-b b-#ececec">
        <span class="text-16px font-bold">
          账号注册
        </span>

        <div class="text-12px">
          <span class="text-14px">
            已有账号?
          </span>
          <span
            class="text-14px cursor-pointer text-blue"
            @click="onGoLogin"
          >
            立即登录
          </span>
        </div>
      </div>

      <Form
        class="px-30px"
        :model="formState"
        name="horizontal_login"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
      >
        <FormItem
          name="address"
          :rules="[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入正确邮箱格式' }
          ]"
        >
          <Input
            v-model:value="formState.address"
            allowClear
            placeholder="邮箱"
          />
        </FormItem>

        <FormItem
          name="captcha"
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <div class="flex">
            <Input
              v-model:value="formState.captcha"
              class="mr-5px"
              allowClear
              placeholder="验证码"
            />

            <Button
              :disabled="captchaNum > 0"
              @click="getCaptcha"
            >
              获取验证码
            </Button>
          </div>
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            class="w-full mt-5px mb-10px rounded-5px tracking-2px"
            :loading="isLoading"
          >
            注册
          </Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormProps } from 'ant-design-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getRegisterCode } from '../../servers/login/index';
import {
  message,
  Form,
  FormItem,
  Button,
  Input,
} from 'ant-design-vue';
import type { RegisterData } from './model';

const router = useRouter();
const isLoading = ref(false);
const captchaNum = ref(0);
const formState = ref<RegisterData>({});
const timer = ref<NodeJS.Timer | null>(null);

/** 跳转登录页 */
const onGoLogin = () => {
  router.push('/login');
};

/** 清除定时器 */
const handleClearInterval = () => {
  clearInterval(timer.value as NodeJS.Timeout);
  timer.value = null;
};

/** 获取验证码 */
const getCaptcha = async () => {
  if (captchaNum.value > 0) return;
  if (!formState.value?.address) {
    return message.warn({
      content: '请输入邮箱',
      key: 'captcha'
    });
  }

  captchaNum.value = 60;
  timer.value = setInterval(() => {
    captchaNum.value = captchaNum.value - 1;
    if (captchaNum.value === 0) {
      handleClearInterval();
    }
  }, 1000);

  try {
    const params = { address: formState.value?.address };
    const { code } = await getRegisterCode(params);
    if (Number(code) === 200) {
      message.success({
        content: '获取验证码成功',
        key: 'getRegisterCode'
      });
    }
  } catch(err) {
    console.error('获取验证码失败:', err);
  }
};

/**
 * 处理登录
 * @param values - 表单数据
 */
 const handleFinish: FormProps['onFinish'] = async (values: RegisterData) => {
 };

/**
 * 处理失败
 * @param errors - 错误信息
 */
const handleFinishFailed: FormProps['onFinishFailed'] = errors => {
  console.error('错误信息:', errors);
  message.error({
    content: '注册失败，请重试',
    key: 'register'
  });
};
</script>

<style lang="less" scoped>
.box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>