import type { PageServerResult, PaginationData, TableData } from '#/public';
import type { DataNode } from 'ant-design-vue/lib/tree';
import type { Key } from 'ant-design-vue/lib/vc-tree/interface';
import { request } from '@/servers/request';

enum API {
  URL = '/system/role',
}

/**
 * 获取分页数据
 * @param data - 请求数据
 */
export function getSystemRolePage(data: PaginationData) {
  return request.get<PageServerResult<TableData[]>>(
    `${API.URL}/page`,
    { params: data }
  );
}

/**
 * 获取全部
 */
export function getSystemRoleAll(data?: unknown) {
  return request.get<TableData[]>(
    `${API.URL}/all`,
    { params: data }
  );
}

/**
 * 根据ID获取数据
 * @param id - 唯一标识
 */
export function getSystemRoleById(id: string) {
  return request.get<{
    defaultCheckedKeys: Key[];
    treeData: DataNode[];
  }>(`${API.URL}/${id}`);
}

/**
 * 新增数据
 * @param data - 请求数据
 */
export function createSystemRole(data: unknown) {
  return request.post(API.URL, data);
}

/**
 * 修改数据
 * @param id - 修改id值
 * @param data - 请求数据
 */
export function updateSystemRole(id: string, data: unknown) {
  return request.patch(`${API.URL}/${id}`, data);
}

/**
 * 删除
 * @param id - 删除id值
 */
export function deleteSystemRole(id: string) {
  return request.delete(`${API.URL}/${id}`);
}
