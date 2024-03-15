<template>
  <div class="flex items-center">
    <Input
      v-bind="attrs"
      v-model:value="inputValue"
      allowClear
      @change="onChange"
    />
    
    <div class="flex items-center p-2px ml-5px b b-#e7e7e7 rounded-5px">
      <Icon :icon="inputValue" class="text-20px" />
    </div>
    <TextBtn
      class="ml-5px text-12px whitespace-nowrap"
      @click="goIconUrl"
    >
      获取图标
    </TextBtn>
  </div>
</template>

<script lang="ts" setup>
import type { InputProps } from 'ant-design-vue';
import { useAttrs, watch, ref } from 'vue';
import { Input } from 'ant-design-vue';
import { Icon } from '@iconify/vue';
import { TextBtn } from '@/components/Buttons';

interface DefineProps {
  value?: string;
  setData?: (open: boolean) => void;
}

const props = withDefaults(defineProps<DefineProps>(), {});

interface DefineEmits {
  (e: 'update:value', value?: string): void;
}

const emit = defineEmits<DefineEmits>();

const attrs = useAttrs();
const inputValue = ref(props.value || '');

watch(() => props.value, value => {
  inputValue.value = value || '';
});

/** 跳转获取图标地址 */
const goIconUrl = () => {
  window.open('https://icon-sets.iconify.design/ion');
};

/**
 * 更改数据
 * @param e - 下标值
 */
const onChange: InputProps['onChange'] = e => {
  emit('update:value', e.target.value);
};
</script>
