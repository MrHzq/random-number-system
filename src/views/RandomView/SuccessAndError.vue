<template>
  <CusLittleTitle :class="typeFullClass">
    <template #title>{{ typeMap[type].text }}的有</template>
    <template #content>
      <div>
        <span>{{ numberList.length }} 个</span>
        <span v-if="numberList.length">，比率为 {{ rate }}</span>
      </div>
      <code v-if="numberList.length" class="flex gap-1 items-center flex-wrap">
        <div>[</div>
        <div v-for="(item, index) in numberList" :key="item" class="flex items-center">
          <CusPopover>
            <template #reference>
              <span class="hover:underline px-1">{{ item }}</span>
            </template>
            <template #content>
              <div class="flex flex-col text-sm text-gray-400">
                <div>
                  <CusLittleTitle>
                    <template #title>开始时间</template>
                    <template #content>{{ numberMap[item].startTime.split(' ')[1] }}</template>
                  </CusLittleTitle>
                </div>
                <div>
                  <CusLittleTitle>
                    <template #title>结束时间</template>
                    <template #content>{{ numberMap[item].endTime.split(' ')[1] }}</template>
                  </CusLittleTitle>
                </div>
                <div>
                  <CusLittleTitle>
                    <template #title>总共耗时</template>
                    <template #content>{{ numberMap[item].diffTime }} 秒</template>
                  </CusLittleTitle>
                </div>
              </div>
            </template>
          </CusPopover>

          <span v-if="index + 1 !== numberList.length">,</span>
        </div>
        <div>]</div>
        <ClipboardDocumentIcon class="h-4 w-4 text-blue-500 cursor-pointer" @click="copyList" />
      </code>
    </template>
  </CusLittleTitle>
</template>

<script setup lang="ts">
import CusLittleTitle from '@/components/CusLittleTitle.vue'
import CusPopover from '@/components/CusPopover.vue'
import { ClipboardDocumentIcon } from '@heroicons/vue/24/outline'
import { ElMessage } from 'element-plus'
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
  number: {
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
  const opacityClass = props.numberList.length || !props.number ? 'opacity-100' : 'opacity-0'
  return className + ' ' + opacityClass
})

const copyList = () => {
  const { toClipboard } = useClipboard()

  try {
    toClipboard(`${props.type}: ${props.numberList}`).then(() => {
      ElMessage({
        message: '复制成功',
        type: 'success'
      })
    })
  } catch (e) {
    ElMessage({
      message: '复制失败',
      type: 'error'
    })
  }
}
</script>
