<template>
  <div
    class="flex items-center flex-col relative pt-32 max-xs:pt-10 max-xs:px-[20px] max-xs:select-none"
  >
    <template v-if="isStart">
      <div
        class="flex flex-col gap-10 max-xs:w-full md:max-w-[80vw] md:min-w-[750px] text-gray-400 max-md:text-sm"
      >
        <!-- 顶部 -->
        <div class="flex justify-between items-center text-sm max-md:flex-col max-md:gap-4">
          <!-- 左侧 -->
          <div class="flex gap-0 items-center">
            <CusLittleTitle class="text-blue-500">
              <template #title>范围</template>
              <template #content>[{{ minNumber }} - {{ maxNumber }}]</template>
            </CusLittleTitle>

            <el-divider direction="vertical" />

            <CusLittleTitle class="text-green-500">
              <template #title>生成</template>
              <template #content>{{ totalCrearedNumber - restNumber }} 次</template>
            </CusLittleTitle>

            <el-divider direction="vertical" />

            <CusLittleTitle class="text-yellow-500">
              <template #title>剩余</template>
              <template #content>{{ restNumber }} 次</template>
            </CusLittleTitle>
          </div>
          <!-- 右侧 -->
          <div class="flex gap-0 items-center">
            <div>
              <CusLittleTitle>
                <template #title>开始时间</template>
                <template #content>{{ fullStartTime.split(' ')[1] }}</template>
              </CusLittleTitle>

              <CusLittleTitle>
                <template #title>当前时间</template>
                <template #content>{{ fullCurrTime.split(' ')[1] }}</template>
              </CusLittleTitle>
            </div>

            <el-divider direction="vertical" />
            <CusLittleTitle>
              <template #title>已用时</template>
              <template #content>{{ fullDiffTime }}</template>
            </CusLittleTitle>
          </div>
        </div>
        <!-- 中间 -->
        <div class="flex justify-center items-center flex-col gap-4">
          <!-- 展示当前的数字 -->
          <div
            v-loading="createdRMLoading"
            class="relative flex justify-center items-center bg-blue-400 text-white w-[150px] h-[150px]"
          >
            <div class="text-[70px] font-bold">{{ currNumber }}</div>
            <div class="absolute bottom-2 text-sm">({{ restNumber ? '当前的' : '最后的' }})</div>
          </div>
          <div class="flex justify-center items-center gap-0 select-none">
            <template v-if="leaveNumber">
              <el-button @click="nextFunWithState('error')" type="danger">
                <span class="font-bold">错了</span>
                <span v-if="restNumber">，下一个</span>
              </el-button>
              <el-button @click="nextFunWithState('success')" type="success">
                <span class="font-bold">对了</span>
                <span v-if="restNumber">，下一个</span>
              </el-button>
            </template>
            <template v-else>
              <div class="h-9 flex justify-center items-center">
                <span class="text-sm">已结束了，</span>
                <span
                  @click="startFun(maxNumber)"
                  class="text-blue-400 text-sm cursor-pointer hover:border-b-[1px] border-blue-400"
                  >重新再来
                </span>
              </div>
            </template>
          </div>
        </div>
        <!-- 底部 -->
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center gap-4">
            <CusLittleTitle>
              <template #title>上一个数</template>
              <template #content>
                <span class="text-lime-700">{{ prevNumber || '无' }}</span></template
              >
            </CusLittleTitle>

            <CusLittleTitle>
              <template #title>下一个数</template>
              <template #content>
                <span class="text-fuchsia-700">{{ nextNumber || '无' }}</span></template
              >
            </CusLittleTitle>
          </div>

          <CusLittleTitle>
            <template #title>已生成数</template>
            <template #content>
              <code>
                {{ createdRMList }}
              </code>
            </template>
          </CusLittleTitle>

          <SuccessAndError
            type="success"
            :numberList="successRMList"
            :numberMap="createdRMMap"
            :rate="successRate"
            :number="leaveNumber"
          />
          <SuccessAndError
            type="error"
            :numberList="errorRMList"
            :numberMap="createdRMMap"
            :rate="errorRate"
            :number="leaveNumber"
          />
        </div>
      </div>
      <div
        class="absolute bottom-[80px] max-xs:bottom-[20px] max-xs:right-[20px] flex justify-end mt-20"
      >
        <el-button type="warning" round @click="endFun">
          {{ leaveNumber ? '提前' : '' }}结束
        </el-button>
      </div>
    </template>
    <template v-else>
      <div class="flex justify-center items-center flex-col gap-4">
        <div class="text-rose-300">请选择最大范围</div>
        <div class="flex justify-center items-center flex-wrap gap-4">
          <el-button
            v-for="number in defaultNumberList"
            :key="number"
            @click="startFun(number)"
            plain
            class="w-20 !ml-0"
          >
            {{ number }}</el-button
          >
        </div>
        <div class="text-gray-400">或手动输入</div>
        <div class="flex justify-center items-center gap-2">
          <el-input-number v-model="inputNumber" placeholder="请输入一个整数" :min="minNumber" />
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
import { calcRate, getRandomNumber } from '@/utils/common'
import { getDiffTime, getFullTime } from '@/utils/day'
import type { ConfigType } from 'dayjs'
import mousetrap from 'mousetrap'

// 默认的随机次数列表
const defaultNumberList = [1, 2, 3, 4, 5].map((item) => item * 10)

const isStart = ref(false) // 是否开始
const fullStartTime = ref('') // 当前整个的开始时间
const fullCurrTime = ref('') // 实时的当前时间
const fullDiffTime = ref('') // 当前整个的使用时间
let fullDiffTimer: number | undefined = undefined // 当前整个的使用时间的定时器
let fullCurrTimer: number | undefined = undefined // 当前整个的使用时间的定时器

// 最小值
const minNumber = ref(1)
// 最大值
const maxNumber = ref(0)
// 要生成的总次数
const totalCrearedNumber = computed(() => maxNumber.value + 1 - minNumber.value)

const inputNumber = ref(minNumber.value + 5) // 输入框的的默认次数

// 上一个随机数
const prevNumber = ref(0)
// 当前随机数
const currNumber = ref(0)
// 下一个随机数
const nextNumber = ref(0)

// 已生成的数据数列表
const createdRMList = reactive<number[]>([])
const createdRMLoading = ref(false)

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
const successRate = computed(() => calcRate(successRMList.length, totalCrearedNumber.value))

// 失败数据列表
const errorRMList = reactive<number[]>([])
// 失败比率
const errorRate = computed(() => calcRate(errorRMList.length, totalCrearedNumber.value))

// 还未放入 successRMList || errorRMList 数量
const leaveNumber = computed(
  () => totalCrearedNumber.value - successRMList.length - errorRMList.length
)

// 还剩余要生成的数量
const restNumber = computed(() => totalCrearedNumber.value - createdRMList.length)

// 重置数据
const reset = () => {
  prevNumber.value = 0
  currNumber.value = 0
  nextNumber.value = 0

  createdRMList.length = 0
  successRMList.length = 0
  errorRMList.length = 0

  clearTimeout(fullDiffTimer)
  clearTimeout(fullCurrTimer)
}

// 初始数据
const init = (number: number) => {
  maxNumber.value = number
  isStart.value = true
  fullStartTime.value = getFullTime()
  openDiffTime()
}

// 开始循环计算时间差
const openDiffTime = () => {
  clearTimeout(fullDiffTimer)
  clearTimeout(fullCurrTimer)
  fullDiffTimer = setInterval(
    (function fn() {
      fullDiffTime.value = getDiffTime(fullStartTime.value) + ' 分'
      return fn
    })(),
    1000 * 60
  )

  fullCurrTimer = setInterval(
    (function fn() {
      fullCurrTime.value = getFullTime()
      return fn
    })(),
    1000
  )
}

const mousetrapBind = (type = 'bind') => {
  const keyMap = {
    right() {
      nextFunWithState('success')
    },
    left() {
      nextFunWithState('error')
    },
    r() {
      startFun(maxNumber.value)
    },
    esc() {
      endFun()
    }
  }

  Object.entries(keyMap).forEach(([key, fun]) => {
    if (type === 'bind') {
      mousetrap.bind(key, () => {
        fun()

        // 返回false以防止默认浏览器行为，并阻止事件冒泡
        return false
      })
    } else {
      mousetrap.unbind(key)
    }
  })
}

// 开始事件
const startFun = (number: number) => {
  if (number) {
    reset()

    mousetrapBind('bind')

    init(number)

    nextFun()
  }
}

// 结束事件
const endFun = () => {
  reset()

  mousetrapBind('unbind')

  isStart.value = false
}

// 生成从 minNumber 到 maxNumber 的随机数
const createRandomNumber = (): number => {
  const rm = getRandomNumber(minNumber.value, maxNumber.value)

  const isExist = createdRMList.includes(rm)

  if (isExist) return createRandomNumber()
  else return rm
}

// 将生成的随机数放入 createdRMList
const pushCreatedRMList = (number: number = nextNumber.value) => {
  createdRMLoading.value = true

  prevNumber.value = currNumber.value

  const startTime = getFullTime()

  currNumber.value = number
  createdRMList.push(number)

  createdRMMap[currNumber.value] = {
    startTime
  } as RecordItem

  setTimeout(() => (createdRMLoading.value = false), 500)
}

// 下一个事件
const nextFun = (isPush = true) => {
  if (restNumber.value) {
    if (!nextNumber.value) nextNumber.value = createRandomNumber()
    if (isPush) {
      pushCreatedRMList(nextNumber.value)
      nextNumber.value = 0
      nextFun(false)
    }
  }
}

// 有状态的下一事件
const nextFunWithState = (status: Status = 'success') => {
  if (leaveNumber.value) {
    if (status === 'success') successRMList.push(currNumber.value)
    else errorRMList.push(currNumber.value)

    const currNumber_EndTime = getFullTime()
    const { startTime } = createdRMMap[currNumber.value]
    createdRMMap[currNumber.value] = {
      startTime,
      endTime: currNumber_EndTime,
      diffTime: getDiffTime(startTime, currNumber_EndTime, 's'),
      status
    }
  }
  nextFun()
}
</script>
