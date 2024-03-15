import dayjs, { type ConfigType, type OpUnitType, type QUnitType } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import 'dayjs/locale/zh-cn' // ES 2015

dayjs.locale('zh-cn') // 全局使用

dayjs.extend(relativeTime)

// 获取当前时间
export const getTime = (time: ConfigType = undefined) => dayjs(time)

// 获取格式化后的当前时间
export const getFormatTime = (time: ConfigType = undefined, format = 'HH:mm:ss') => {
  return dayjs(time).format(format)
}

// 获取完整格式化后的当前时间
export const getFullTime = () => getFormatTime(undefined, 'YYYY-MM-DD HH:mm:ss')

export const getFromNow = (time?: ConfigType, flag = false) => {
  return dayjs(time).fromNow(flag)
}

export const getDiffTime = (
  time1: ConfigType = undefined,
  time2: ConfigType = undefined,
  unit: QUnitType | OpUnitType = 'minute'
): number => {
  return dayjs(time1).diff(dayjs(time2), unit)
}

console.log('[ dayjs(20214000000) ] >', dayjs(20214000000))
