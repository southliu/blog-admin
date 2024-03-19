import { addComponent } from "../Form/utils/componentMap";
import RoleSelect from './Selects/RoleSelect.vue';

/**
 * 组件类型
 * @description 每次引入组件时，需要声明类型
 */
export type BusinessComponentType = 'RoleSelect'

/** 生成业务组件 */
export function createBusinessComp() {
  addComponent('RoleSelect', RoleSelect);
}
