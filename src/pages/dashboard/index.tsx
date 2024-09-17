import type { FormData } from '#/form';
import { useCallback, useEffect, useState } from 'react';
import { getDataTrends } from '@/servers/dashboard';
import { searchList } from './model';
import { useUnactivate } from 'react-activation';
import { useTranslation } from 'react-i18next';
import BaseSearch from '@/components/Search/BaseSearch';
import BaseContent from '@/components/Content/BaseContent';
import Bar from './components/Bar';
import Line from './components/Line';
import Block from './components/Block';

// 初始化搜索
const initSearch = {
  pay_date: ['2022-10-19', '2022-10-29']
};

function Dashboard() {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);

  /**
   * 搜索提交
   * @param values - 表单返回数据
   */
  const handleSearch = useCallback(async (values: FormData) => {
    // 数据转换
    values.all_pay = values.all_pay ? 1 : undefined;

    const query = { ...values };
    try {
      setLoading(true);
      await getDataTrends(query);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleSearch(initSearch);
  }, [handleSearch]);

  useUnactivate(() => {
    console.log('退出时执行');
  });

  return (
    <BaseContent isPermission={true}>
      <BaseSearch
        list={searchList(t)}
        data={initSearch}
        isLoading={isLoading}
        handleFinish={handleSearch}
      />

      <div className='py-10px'>
        <Block />
      </div>

      <div className='flex justify-between w-full'>
        <Line />
        <Bar />
      </div>
    </BaseContent>
  );
}

export default Dashboard;
