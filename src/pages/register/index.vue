<template>
  <div class="bg-light-400 w-screen h-screen">
    <div class="box w-370px rounded-5px bg-white box-border">
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
        :labelCol="{ style: { width: '65px' } }"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
      >
        <FormItem
          name="username"
          label="用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <Input
            v-model:value="formState.username"
            allowClear
            placeholder="用户名"
            autoComplete="username"
          />
        </FormItem>

        <FormItem
          name="password"
          label="密码"
          :rules="[
            { required: true, message: '请输入密码' },
            PASSWORD_RULE
          ]"
        >
          <InputPassword
            v-model:value="formState.password"
            allowClear
            placeholder="密码"
            autoComplete="current-password"
          />
        </FormItem>

        <FormItem
          name="email"
          label="邮箱"
          :rules="[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入正确邮箱格式' }
          ]"
        >
          <Input
            v-model:value="formState.email"
            allowClear
            placeholder="邮箱"
          />
        </FormItem>

        <FormItem
          name="captcha"
          label="验证码"
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
              class="min-w-102px flex-1"
              :disabled="captchaNum > 0"
              @click="getCaptcha"
            >
              <span v-if="captchaNum > 0">
                {{ captchaNum }}秒
              </span>
              <span v-else>
                获取验证码
              </span>
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
import { onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getRegisterCode, register } from '../../servers/login/index';
import {
  message,
  Form,
  FormItem,
  Button,
  Input,
  InputPassword,
} from 'ant-design-vue';
import type { RegisterData } from './model';
import { PASSWORD_RULE } from '@/utils/verify';

const router = useRouter();
const isLoading = ref(false);
const captchaNum = ref(0);
const formState = ref<RegisterData>({});
const timer = ref<NodeJS.Timer | null>(null);

onBeforeUnmount(() => {
  if (timer.value) {
    handleClearInterval();
  }
});

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
  if (!formState.value?.email) {
    return message.warn({
      content: '请输入邮箱',
      key: 'captcha'
    });
  }

  try {
    const params = { email: formState.value?.email };
    const { code } = await getRegisterCode(params);
    if (Number(code) === 200) {
      message.success({
        content: '获取验证码成功',
        key: 'getRegisterCode'
      });

      captchaNum.value = 60;
      timer.value = setInterval(() => {
        captchaNum.value = captchaNum.value - 1;
        if (captchaNum.value === 0) {
          handleClearInterval();
        }
      }, 1000);
    }
  } catch(err) {
    console.error('获取验证码失败:', err);
  }
};

/**
 * 处理登录
 * @param values - 表单数据
 */
 const handleFinish: FormProps['onFinish'] = async () => {
  try {
    isLoading.value = true;
    const { code } = await register(formState.value);
    if (Number(code) === 200) {
      message.success({
        content: '注册成功',
        key: 'registerSuccess'
      });
      router.push('/login');
    }
  } finally {
    isLoading.value = false;
  }
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