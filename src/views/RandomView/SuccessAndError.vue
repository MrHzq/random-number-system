<template>
  <LittleTitle :class="typeFullClass">
    <template #title>{{ typeMap[type].text }}的有</template>
    <template #content>
      <div>
        <span>{{ list.length }} 个，</span>
        <span>比率为 {{ rate }}</span>
      </div>
      <code class="flex gap-1">
        <div>[</div>
        <div v-for="(item, index) in list" :key="item" class="flex items-center">
          <span>{{ item.value }}</span>
          <Popover>
            <template #content>
              <div class="flex flex-col text-sm text-gray-400">
                <div>
                  <LittleTitle>
                    <template #title>开始时间</template>
                    <template #content>{{ item.startTime.split(' ')[1] }}</template>
                  </LittleTitle>
                </div>
                <div>
                  <LittleTitle>
                    <template #title>结束时间</template>
                    <template #content>{{ item.endTime.split(' ')[1] }}</template>
                  </LittleTitle>
                </div>
                <div>
                  <LittleTitle>
                    <template #title>总共耗时</template>
                    <template #content>{{ item.diffTime }} 秒</template>
                  </LittleTitle>
                </div>
              </div>
            </template>
          </Popover>

          <span v-if="index + 1 !== list.length">,</span>
        </div>
        <div>]</div>
      </code>
    </template>
  </LittleTitle>
</template>

<script setup lang="ts">
import LittleTitle from '@/components/LittleTitle.vue'
import Popover from '@/components/Popover.vue'
import { computed, reactive, toRefs } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    default: 'success'
  },
  successClass: String,
  errorClass: String,
  yiliuNumber: {
    type: Number,
    required: true
  },
  rate: {
    type: String,
    required: true
  },
  list: {
    type: Object,
    required: true,
    default() {
      return []
    }
  }
})

interface TypeMap {
  [key: string]: {
    text: string
    className: string
  }
}
const typeMap = reactive<TypeMap>({
  success: {
    text: '正确',
    className: 'text-green-500 ' + props.successClass
  },
  error: {
    text: '错误',
    className: 'text-red-500 ' + props.errorClass
  }
})

const typeFullClass = computed(() => {
  const { className } = typeMap[props.type]
  const opacityClass = props.list.length || !props.yiliuNumber ? 'opacity-100' : 'opacity-0'
  return className + ' ' + opacityClass
})
</script>
