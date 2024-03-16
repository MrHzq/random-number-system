<template>
  <LittleTitle :class="typeFullClass">
    <template #title>{{ typeMap[type].text }}的有</template>
    <template #content>
      <div>
        <span>{{ numberList.length }} 个</span>
        <span v-if="numberList.length">，比率为 {{ rate }}</span>
      </div>
      <code v-if="numberList.length" class="flex gap-1 items-center">
        <div>[</div>
        <div v-for="(item, index) in numberList" :key="item" class="flex items-center">
          <Popover>
            <template #reference>
              <span class="hover:underline px-1">{{ item }}</span>
            </template>
            <template #content>
              <div class="flex flex-col text-sm text-gray-400">
                <div>
                  <LittleTitle>
                    <template #title>开始时间</template>
                    <template #content>{{ numberMap[item].startTime.split(' ')[1] }}</template>
                  </LittleTitle>
                </div>
                <div>
                  <LittleTitle>
                    <template #title>结束时间</template>
                    <template #content>{{ numberMap[item].endTime.split(' ')[1] }}</template>
                  </LittleTitle>
                </div>
                <div>
                  <LittleTitle>
                    <template #title>总共耗时</template>
                    <template #content>{{ numberMap[item].diffTime }} 秒</template>
                  </LittleTitle>
                </div>
              </div>
            </template>
          </Popover>

          <span v-if="index + 1 !== numberList.length">,</span>
        </div>
        <div>]</div>
        <ClipboardDocumentIcon class="h-4 w-4 text-blue-500 cursor-pointer" @click="copyList()" />
      </code>
    </template>
  </LittleTitle>
</template>

<script setup lang="ts">
import LittleTitle from '@/components/LittleTitle.vue'
import Popover from '@/components/Popover.vue'
import { ClipboardDocumentIcon } from '@heroicons/vue/24/outline'
import { computed, reactive } from 'vue'
import useClipboard from 'vue-clipboard3'

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
  numberList: {
    type: Object,
    required: true,
    default() {
      return []
    }
  },
  numberMap: {
    type: Object,
    required: true,
    default() {
      return {}
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
  const opacityClass = props.numberList.length || !props.yiliuNumber ? 'opacity-100' : 'opacity-0'
  return className + ' ' + opacityClass
})

const copyList = async () => {
  const { toClipboard } = useClipboard()
  try {
    await toClipboard(`${props.type}: ${props.numberList}`)
    alert('复制成功')
  } catch (e) {
    console.error(e)
    alert('复制失败')
  }
}
</script>
