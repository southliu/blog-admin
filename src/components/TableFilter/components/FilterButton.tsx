import {
  type ButtonProps,
  type TableProps,
  Button,
  Popover,
  Divider,
  Checkbox,
} from 'antd';
import { useState } from "react";
import { UnorderedListOutlined } from '@ant-design/icons';

/**
 * 表格字段筛选
 */

interface CheckboxList {
  label: string;
  value: string;
}

interface Props extends ButtonProps {
  columns: TableProps['columns'];
}

function FilterButton(props: Props) {
  const { columns } = props;
  const [isOpen, setOpen] = useState(false);
  
  /** 处理点击事件 */
  const handleClick = () => {
    setOpen(!isOpen);
  };

  /**
   * 过滤表格数据为多选组数据
   * @param columns - 表格数据
   */
  const filterColumns = (columns: TableProps['columns']): CheckboxList[] => {
    if (!columns?.length) return [];
    const result: CheckboxList[] = [];

    for (let i = 0; i < columns?.length; i++) {
      const item = columns[i];
      result.push({
        label: item.title as string,
        value: (item as { dataIndex: string })?.dataIndex
      });
    }

    return result;
  };

  // 渲染内容
  const content = () => {
    const list = filterColumns(columns);

    return (
      <div className='min-w-130px'>
        <Checkbox.Group
          className='flex flex-col !px-12px'
        >
          {
            list?.map(item => (
              <div key={item.value}>
                <Checkbox
                  value={item.value}
                >
                  { item.label }
                </Checkbox>
              </div>
            ))
          }
        </Checkbox.Group>

        <Divider className='!mt-10px !mb-5px' />

        <div className='flex justify-end px-10px'>
          <Button
            size='small'
            className='mr-5px'
            onClick={handleClick}
          >
            取消
          </Button>

          <Button
            type='primary'
            size='small'
          >
            筛选
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Popover
      content={content}
      trigger='click'
      placement='bottom'
      overlayInnerStyle={{
        padding: '12px 0 10px'
      }}
      open={isOpen}
      onOpenChange={handleClick}
    >
      <Button
        icon={<UnorderedListOutlined />}
        {...props}
      >
        { props?.children || '字段筛选' }
      </Button>
    </Popover>
  );
}

export default FilterButton;