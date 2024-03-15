<script setup lang="ts">
import LittleTitle from '@/components/LittleTitle.vue'
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

<template>
  <LittleTitle :class="typeFullClass">
    <template #title>{{ typeMap[type].text }}的有</template>
    <template #content>
      <div>
        <span>{{ list.length }} 个，</span>
        <span>比率为 {{ rate }}</span>
      </div>
      <code>{{ list }}</code>
    </template>
  </LittleTitle>
</template>
