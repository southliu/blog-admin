import type { InputProps } from 'antd';
import { Button, Input } from 'antd';

function IconInput(props: InputProps) {
  return (
    <div className='flex'>
      <Input {...props} />

      <Button className='ml-10px'>
        添加
      </Button>
    </div>
  )
}

export default IconInput