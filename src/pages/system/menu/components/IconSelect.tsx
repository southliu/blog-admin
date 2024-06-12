import type { SelectProps } from 'antd';
import { Select } from 'antd';
import { menuIcons } from '@/utils/menuIcons';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import BasicPagination from '@/components/Pagination/BasicPagination';

const pageSize = 70;

function IconInput(props: SelectProps) {
  const [iconValue, setIconValue] = useState(props.value || '');
  const [isOpen, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [list, setList] = useState<string[]>(handleFilterList(menuIcons));

  useEffect(() => {
    if (iconValue !== props.value) {
      setIconValue(props.value || '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  /**
   * 处理分页数据
   * @param list - 列表数据
   */
  function handleFilterList(list: string[], page = 1) {
    if (!list?.length) return [];

    const start = (page - 1) * pageSize;
    const end = pageSize * page;
    const result: string[] = [];

    for (let i = start; i <= end && i < list.length; i++) {
      const item = list[i];
      result.push(item);
    }

    return result;
  }

  /**
   * 处理分页
   * @param page - 当前页数
   * @param pageSize - 每页条数
   */
  const onChangePagination = (page: number) => {
    setPage(page);
    const list = handleFilterList(menuIcons, page);
    setList(list);
  };

  /** 下拉回调 */
  const onDropdownVisibleChange = (open: boolean) => {
    setOpen(open);
  };

  /**
   * 点击菜单
   * @param value
   */
  const handleClick = (value: string) => {
    setIconValue(value);
    setOpen(false);
    props.onChange?.(value, []);
  };

  /** 渲染下拉框内容 */
  const contentRender = () => (
    <>
      <div className='flex flex-wrap'>
        {
          list.map((item, index) => (
            <div
              key={index}
              className='w-30px h-30px flex items-center justify-center border border-#8c8c8c box-border cursor-pointer'
              onClick={() => handleClick(item)}
            >
              <Icon icon={item} />
            </div>
          ))
        }
      </div>

      <div className='flex justify-end mt-5px mb-3px'>
        <BasicPagination
          current={page}
          pageSize={pageSize}
          showSizeChanger={false}
          showQuickJumper={false}
          total={menuIcons?.length || 0}
          onChange={onChangePagination}
        />
      </div>
    </>
  );

  return (
    <Select
      {...props}
      open={isOpen}
      options={[]}
      notFoundContent={<span>暂无数据</span>}
      dropdownRender={contentRender}
      onDropdownVisibleChange={onDropdownVisibleChange}
    />
  );  
}

export default IconInput;