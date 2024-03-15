<template>
  <div class="flex items-center flex-col relative mt-20">
    <template v-if="isSatrt">
      <div class="gap-8 max-w-[80vw] min-w-[600px] text-gray-400">
        <!-- 顶部 -->
        <div class="flex justify-between items-center mb-8 text-sm">
          <!-- 左侧 -->
          <div class="flex gap-2">
            <div class="flex justify-center items-center text-blue-500">
              <span>随机范围：</span>
              <span>[{{ minNumber }} - {{ limitNumber }}]</span>
            </div>
            <div class="flex justify-center items-center text-yellow-500">
              <span>已生成：</span>
              <span>{{ limitNumber - restNumber }} 次</span>
            </div>
            <div class="flex justify-center items-center text-yellow-500">
              <span>还可生成：</span>
              <span>{{ restNumber }} 次</span>
            </div>
          </div>
          <!-- 右侧 -->
          <div></div>
        </div>
        <!-- 中间 -->
        <div class="flex justify-center items-center flex-col gap-4">
          <div
            class="flex justify-center items-center flex-col gap-4 bg-blue-400 text-white w-[150px] h-[150px]"
          >
            <div class="text-[70px] font-bold">{{ currNumber }}</div>
            <div class="text-sm">({{ restNumber ? '当前的' : '最后的' }})</div>
          </div>
          <div class="flex justify-center items-center gap-4 select-none">
            <template v-if="yiliuNumber">
              <MyButton @click="nextFun('error')" class="bg-red-500 border-red-500">
                <span class="font-bold">错了</span>
                <span v-if="restNumber">，下一个</span></MyButton
              >
              <MyButton @click="nextFun('success')" class="bg-green-500 border-green-500">
                <span class="font-bold">对了</span>
                <span v-if="restNumber">，下一个</span></MyButton
              >
            </template>
            <template v-else>
              <div class="h-9 flex justify-center items-center">
                <span class="text-sm">已结束了，</span>
                <span
                  @click="startFun()"
                  class="text-blue-400 text-sm cursor-pointer hover:border-b-[1px] border-blue-400"
                  >重新再来</span
                >
              </div>
            </template>
          </div>
        </div>
        <!-- 底部 -->
        <div class="mt-8 flex flex-col gap-4">
          <div class="select-none">
            <span> 上一个数：</span>
            <span>{{ prevNumber }}</span>
          </div>
          <div>
            <span> 已生成数：</span>
            <code>{{ createdRandomNumberList }}</code>
          </div>

          <SuccessAndError
            type="success"
            :list="successRandomNumberList"
            :rate="successRate"
            :yiliuNumber="yiliuNumber"
          />
          <SuccessAndError
            type="error"
            :list="errorRandomNumberList"
            :rate="errorRate"
            :yiliuNumber="yiliuNumber"
          />

          <!-- <LittleTitle
            class="text-green-500"
            :class="successRandomNumberList.length || !yiliuNumber ? 'opacity-100' : 'opacity-0'"
          >
            <template #title> 正确的有</template>
            <template #content>
              <div class="text-sm">
                <span>{{ successRandomNumberList.length }} 个，</span>
                <span>比率为 {{ successRate }}</span>
              </div>
              <code>{{ successRandomNumberList }}</code>
            </template>
          </LittleTitle>
          <LittleTitle
            class="text-red-500"
            :class="errorRandomNumberList.length || !yiliuNumber ? 'opacity-100' : 'opacity-0'"
          >
            <template #title>错误的有</template>
            <template #content>
              <div class="text-sm">
                <span>{{ errorRandomNumberList.length }} 个，</span>
                <span>比率为 {{ errorRate }}</span>
              </div>

              <code>{{ errorRandomNumberList }}</code>
            </template>
          </LittleTitle> -->
        </div>
      </div>
      <div class="absolute bottom-[80px] flex justify-end mt-20">
        <MyButton class="bg-gray-400 border-gray-400" @click="isSatrt = false">
          {{ yiliuNumber ? '提前' : '' }}结束
        </MyButton>
      </div>
    </template>
    <template v-else>
      <div class="flex justify-center items-center flex-col gap-8">
        <div class="text-rose-300">请选择或输入一个数字</div>
        <div class="flex gap-4">
          <MyButton
            v-for="number in defaultNumberList"
            :key="number"
            class="bg-white text-blue-400 hover:text-white hover:bg-blue-400"
            @click="startFun(number)"
          >
            {{ number }}</MyButton
          >
        </div>
        <div class="text-gray-400">或者</div>
        <div class="flex justify-center items-center gap-2">
          <input
            v-model="inputNumber"
            placeholder="请输入一个整数"
            type="number"
            class="w-[100px] border-2 py-1 px-2 rounded text-blue-800"
          />
          <MyButton class="h-9 text-sm" @click="startFun(inputNumber)">开始</MyButton>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import MyButton from '@/components/MyButton.vue'
import SuccessAndError from './SuccessAndError.vue'
import { computed, reactive, ref } from 'vue'

const defaultNumberList = [1, 2, 3, 4, 5].map((item) => item * 10)

const isSatrt = ref(false)

const minNumber = ref(1)
const limitNumber = ref(0)

const inputNumber = ref(5)
const prevNumber = ref(0)
const currNumber = ref(0)

// 已生成的数据数列表
const createdRandomNumberList = reactive<number[]>([])
const successRandomNumberList = reactive<number[]>([])

// 计算两数相除，有小数的话保留 2位
const divide = (num1: number, num2: number) => {
  const result = num1 / num2
  return Number.isInteger(result) ? result : result.toFixed(2)
}
// 成功比率
const successRate = computed(
  () => divide(successRandomNumberList.length * 100, limitNumber.value) + '%'
)

const errorRandomNumberList = reactive<number[]>([])
// 成功比率
const errorRate = computed(
  () => divide(errorRandomNumberList.length * 100, limitNumber.value) + '%'
)

// 还未放入 successRandomNumberList || errorRandomNumberList 数量
const yiliuNumber = computed(() => {
  return limitNumber.value - successRandomNumberList.length - errorRandomNumberList.length
})

// 还剩余要生成的数量
const restNumber = computed(() => {
  return limitNumber.value - createdRandomNumberList.length
})

// 初始化数据
const init = () => {
  prevNumber.value = 0
  currNumber.value = 0
  createdRandomNumberList.length = 0
  successRandomNumberList.length = 0
  errorRandomNumberList.length = 0
}

// 开始事件
const startFun = (number: number = limitNumber.value) => {
  init()
  limitNumber.value = number
  isSatrt.value = true
  createRandomNumber()
}

// 生成从 1 到 limitNumber 的随机数
const createRandomNumber = () => {
  const randomNumber = Math.floor(Math.random() * limitNumber.value) + minNumber.value

  const isExist = createdRandomNumberList.includes(randomNumber)
  if (isExist) {
    createRandomNumber()
  } else {
    prevNumber.value = currNumber.value
    currNumber.value = randomNumber
    createdRandomNumberList.push(randomNumber)
  }
}
const nextFun = (type: string = 'success') => {
  if (yiliuNumber.value) {
    if (type === 'success') {
      successRandomNumberList.push(currNumber.value)
    } else if (type === 'error') {
      errorRandomNumberList.push(currNumber.value)
    }
  }

  if (restNumber.value) createRandomNumber()
}
</script>
