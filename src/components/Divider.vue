<template>
  <div class="bg-gray-300 scale-y-[80%]" :class="className"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

//'horizontal'水平 | 'vertical'垂直

const props = defineProps({
  type: {
    type: String,
    default: 'vertical'
  }
})

interface TypeClassNameMap {
  [key: string]: string
}
const typeClassNameMap: TypeClassNameMap = {
  horizontal: 'w-full h-[2px]',
  vertical: 'h-auto w-[2px]'
}

const className = computed(() => {
  return typeClassNameMap[props.type]
})
</script>

<style scoped></style>
