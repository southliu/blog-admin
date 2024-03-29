<template>
  <div>
    <Button
      v-for="item in list"
      :key="item.value"
      :loading="isLoading"
      class="mr-10px"
      @click="handleClick(item.value)"
    >
      <template #icon>
        <Icon
          class="text-17px mt-2px"
          icon='fluent:table-freeze-row-24-regular'
        />
      </template>
      <span>{{ item.title }}</span>
    </Button>
  </div>
</template>

<script lang="ts" setup>
/**
 * @description: 时间选择组件
 * @param isLoading - 加载
 * @param date - 时间字符串
 * @param format - 时间格式化
 * @result string[]
 */
import { Button } from 'ant-design-vue';
import { DATE_FORMAT } from '@/utils/config';
import { Icon } from '@iconify/vue';
import dayjs from 'dayjs';

type TypeData = 'yesterday' |
              'tomorrow' |
              'today' |
              'prevMonth' |
              'nextMonth' |
              'month'

interface ListData {
  title: string;
  value: TypeData;
}

interface DefineEmits {
  (e: 'handleResult', value: string[]): void;
}

const emit = defineEmits<DefineEmits>();

interface DefineProps {
  isLoading?: boolean;
  date: string;
  format?: string;
}

const props = withDefaults(defineProps<DefineProps>(), {
  isLoading: false,
  format: DATE_FORMAT
});

const list: ListData[] = [
  { title: '前一天', value: 'yesterday' },
  { title: '下一天', value: 'tomorrow' },
  { title: '当天', value: 'today' },
  { title: '前一月', value: 'prevMonth' },
  { title: '下一月', value: 'nextMonth' },
  { title: '本月', value: 'month' },
];

/**
 * 处理点击
 * @param type = 类型 
 */
const handleClick = (type: TypeData) => {
  let result: string[] = [];
  switch (type) {
    // 前一天
    case 'yesterday': {
      const date = dayjs(props.date).subtract(1, 'd').format(props.format);
      result = [date, date];
      break;
    }

    // 下一天
    case 'tomorrow': {
      const date = dayjs(props.date).add(1, 'd').format(props.format);
      result = [date, date];
      break;
    }

    // 当天
    case 'today': {
      const date = dayjs().format(props.format);
      result = [date, date];
      break;
    }

    // 前一月
    case 'prevMonth': {
      const start = dayjs(props.date)
                    .subtract(1, 'month')
                    .startOf('month')
                    .format(props.format);
      const end = dayjs(props.date)
                    .subtract(1, 'month')
                    .endOf('month')
                    .format(props.format);
      result = [start, end];
      break;
    }

    // 下一月
    case 'nextMonth': {
      const start = dayjs(props.date)
                    .add(1, 'month')
                    .startOf('month')
                    .format(props.format);
      const end = dayjs(props.date)
                    .add(1, 'month')
                    .endOf('month')
                    .format(props.format);
      result = [start, end];
      break;
    }

    // 本月
    case 'month': {
      const start = dayjs().startOf('month').format(props.format);
      const end = dayjs().endOf('month').format(props.format);
      result = [start, end];
      break;
    }

    default:
      break;
  }
  emit('handleResult', result);
};
</script>
