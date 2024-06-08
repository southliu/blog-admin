import { Button, type TableProps } from "antd";
// import { useState } from "react";

/**
 * 表格字段筛选
 */

export function useFilterColumns(columns?: TableProps['columns'], title?: string) {
  // const [first, setFirst] = useState([]);

  const FilterButton = () => (
    <Button>
      { title || '字段筛选' }
    </Button>
  );
  
  return [FilterButton] as const;
}
