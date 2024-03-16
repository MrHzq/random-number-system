<template>
  <div class="flex items-center flex-col relative mt-20">
    <template v-if="isStart">
      <div class="gap-8 max-w-[80vw] min-w-[700px] text-gray-400">
        <!-- 顶部 -->
        <div class="flex justify-between items-center mb-8 text-sm">
          <!-- 左侧 -->
          <div class="flex gap-2 items-center">
            <CusLittleTitle class="text-blue-500">
              <template #title>随机范围</template>
              <template #content>[{{ minNumber }} - {{ maxNumber }}]</template>
            </CusLittleTitle>

            <el-divider direction="vertical" />

            <CusLittleTitle class="text-green-500">
              <template #title>已生成</template>
              <template #content>{{ maxNumber - restNumber }} 次</template>
            </CusLittleTitle>

            <el-divider direction="vertical" />

            <CusLittleTitle class="text-yellow-500">
              <template #title>还剩余</template>
              <template #content>{{ restNumber }} 次</template>
            </CusLittleTitle>
          </div>
          <!-- 右侧 -->
          <div class="flex gap-2 items-center">
            <CusLittleTitle>
              <template #title>开始时间</template>
              <template #content>{{ startTime.split(' ')[1] }}</template>
            </CusLittleTitle>

            <el-divider direction="vertical" />

            <CusLittleTitle>
              <template #title>已用时</template>
              <template #content>{{ useTime }}</template>
            </CusLittleTitle>
          </div>
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
              <el-button @click="nextFun('error')" type="danger">
                <span class="font-bold">错了</span>
                <span v-if="restNumber">，下一个</span>
              </el-button>
              <el-button @click="nextFun('success')" type="success">
                <span class="font-bold">对了</span>
                <span v-if="restNumber">，下一个</span>
              </el-button>
            </template>
            <template v-else>
              <div class="h-9 flex justify-center items-center">
                <span class="text-sm">已结束了，</span>
                <span
                  @click="startFun()"
                  class="text-blue-400 text-sm cursor-pointer hover:border-b-[1px] border-blue-400"
                  >重新再来
                </span>
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
            <code>{{ createdRMList }}</code>
          </div>

          <SuccessAndError
            type="success"
            :numberList="successRMList"
            :numberMap="createdRMMap"
            :rate="successRate"
            :yiliuNumber="yiliuNumber"
          />
          <SuccessAndError
            type="error"
            :numberList="errorRMList"
            :numberMap="createdRMMap"
            :rate="errorRate"
            :yiliuNumber="yiliuNumber"
          />
        </div>
      </div>
      <div class="absolute bottom-[80px] flex justify-end mt-20">
        <el-button type="warning" round @click="isStart = false">
          {{ yiliuNumber ? '提前' : '' }}结束
        </el-button>
      </div>
    </template>
    <template v-else>
      <div class="flex justify-center items-center flex-col gap-4">
        <div class="text-rose-300">请选择数字</div>
        <div class="flex">
          <el-button
            v-for="number in defaultNumberList"
            :key="number"
            @click="startFun(number)"
            plain
            class="w-20"
          >
            {{ number }}</el-button
          >
        </div>
        <div class="text-gray-400">或输入数字</div>
        <div class="flex justify-center items-center gap-2">
          <el-input-number v-model="inputNumber" placeholder="请输入一个整数" :min="1" :max="10" />
          <el-button type="primary" @click="startFun(inputNumber)">开始</el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import SuccessAndError from './SuccessAndError.vue'
import { computed, reactive, ref, watch } from 'vue'
import CusLittleTitle from '@/components/CusLittleTitle.vue'
import { calcRate, randomNumber } from '@/utils/common'
import { getDiffTime, getFullTime } from '@/utils/day'
import type { ConfigType } from 'dayjs'
import mousetrap from 'mousetrap'

// 默认的随机次数列表
const defaultNumberList = [1, 2, 3, 4, 5].map((item) => item * 10)
const inputNumber = ref(5) // 输入框的的默认次数

const isStart = ref(false)
const startTime = ref('')
let diffTimer: number | undefined = undefined
const useTime = ref('')

// 最小值
const minNumber = ref(1)
// 最大值
const maxNumber = ref(0)

// 上一个随机数
const prevNumber = ref(0)
// 当前随机数
const currNumber = ref(0)

// 已生成的数据数列表
const createdRMList = reactive<number[]>([])

type Status = 'success' | 'error'
export interface RecordItem {
  startTime: ConfigType
  endTime: ConfigType
  diffTime: number
  status: Status
}
// 已生成的数据对应的其他详细信息：所耗时间
const createdRMMap = reactive<Record<number, RecordItem>>({})

// 成功数据列表
const successRMList = reactive<number[]>([])

// 成功比率
const successRate = computed(() => calcRate(successRMList.length, maxNumber.value))

// 失败数据列表
const errorRMList = reactive<number[]>([])
// 失败比率
const errorRate = computed(() => calcRate(errorRMList.length, maxNumber.value))

// 还未放入 successRMList || errorRMList 数量
const yiliuNumber = computed(() => maxNumber.value - successRMList.length - errorRMList.length)

// 还剩余要生成的数量
const restNumber = computed(() => maxNumber.value - createdRMList.length)

// 初始化数据
const init = () => {
  prevNumber.value = 0
  currNumber.value = 0
  createdRMList.length = 0
  successRMList.length = 0
  errorRMList.length = 0
}

// 开始事件
const startFun = (number: number = maxNumber.value) => {
  init()
  maxNumber.value = number
  isStart.value = true
  startTime.value = getFullTime()
  createRandomNumber()
  openDiffTime()
}

// 生成从 minNumber 到 maxNumber 的随机数
const createRandomNumber = () => {
  const _randomNumber = randomNumber(minNumber.value, maxNumber.value)

  const isExist = createdRMList.includes(_randomNumber)
  if (isExist) {
    createRandomNumber() // 重新生成
  } else {
    prevNumber.value = currNumber.value

    const startTime = getFullTime()

    currNumber.value = _randomNumber
    createdRMList.push(_randomNumber)

    createdRMMap[currNumber.value] = {
      startTime
    } as RecordItem
  }
}

// 开始循环计算时间差
const openDiffTime = () => {
  clearTimeout(diffTimer)
  diffTimer = setInterval(
    (function fn() {
      useTime.value = getDiffTime(startTime.value) + ' 分'
      return fn
    })(),
    1000
  )
}

// 下一个事件
const nextFun = (status: Status = 'success') => {
  if (yiliuNumber.value) {
    if (status === 'success') successRMList.push(currNumber.value)
    else errorRMList.push(currNumber.value)

    const endTime = getFullTime()
    const { startTime } = createdRMMap[currNumber.value]
    createdRMMap[currNumber.value] = {
      startTime,
      endTime,
      diffTime: getDiffTime(startTime, endTime, 's'),
      status
    }
  }

  if (restNumber.value) createRandomNumber()
}

mousetrap.bind('right', () => nextFun())
</script>
