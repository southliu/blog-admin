import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

/**
 * 检测是否有权限
 * @param value - 检测值
 * @param permissions - 权限
 */
export const checkPermission = (value: string): boolean => {
  const userStore = useUserStore();
  const { permissions } = storeToRefs(userStore);

  if (!permissions || permissions.value?.length === 0) return false;
  return permissions.value?.includes(value);
};
