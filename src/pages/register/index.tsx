import type { FormProps } from "antd/lib";
import { type ThemeType } from "@/stores/public";
import { useState } from "react";
import { THEME_KEY } from "@/utils/config";
import { Button, Form, Input, message } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import I18n from "@/components/I18n";

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setLoading] = useState(false);
  const themeCache = (localStorage.getItem(THEME_KEY) || 'light') as ThemeType;

  /** 跳转登录页 */
  const onGoLogin = () => {
    navigate('/login');
  };
  
  /**
   * 处理登录
   * @param values - 表单数据
   */
  const handleFinish: FormProps['onFinish'] = async (values: { address: string }) => {
    try {
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理失败
   * @param errors - 错误信息
   */
  const handleFinishFailed: FormProps['onFinishFailed'] = errors => {
    console.error('错误信息:', errors);
  };

  return (
    <>
      { contextHolder }
      <div className={`
        ${themeCache === 'dark' ? 'bg-black text-white' : 'bg-light-400'}
        w-screen
        h-screen
        relative
      `}>
        <div className="absolute top-5 right-5">
          <I18n />
        </div>
        <div className={`
          w-300px
          h-290px
          rounded-5px
          ${themeCache === 'dark' ? 'bg-black bg-dark-200' : 'bg-white'}
          box-border
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
        `}>
         <div className="px-20px py-10px mb-30px flex items-center justify-between b-b b-#ececec">
            <span className="text-16px font-bold">
              { t('login.registerUser') }
            </span>

            <div className="text-12px">
              <span className="text-14px">
                { t('login.haveUser') }
              </span>
              <span
                className="text-14px cursor-pointer text-blue"
                onClick={onGoLogin}
              >
                { t('login.directLogin') }
              </span>
            </div>
          </div>
          <div className="p-30px pt-0">
            <Form
              name="horizontal_login"
              autoComplete="on"
              onFinish={handleFinish}
              onFinishFailed={handleFinishFailed}
              initialValues={{
                username: 'admin',
                password: 'admin123456'
              }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: t('public.pleaseEnter', { name: t('login.username') }) }]}
              >
                <Input
                  allow-clear="true"
                  placeholder={t('login.username')}
                  data-test="username"
                  autoComplete="username"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full mt-5px rounded-5px tracking-2px mb-10px"
                  loading={isLoading}
                >
                  { t('login.login') }
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
