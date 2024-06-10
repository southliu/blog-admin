import { TableProps } from "antd";

// 隐藏表格未勾选数据
export const handleFilterTable = (columns: TableProps['columns'], checks: string[]) => {
  const result: TableProps['columns'] = JSON.parse(JSON.stringify(columns));
  if (!result?.length) return [];

  for (let i = 0; i < result?.length; i++) {
    const item = result[i] as { dataIndex: string; hidden: boolean; };
    item.hidden = !checks.includes(item.dataIndex);
  }

  return result;
};