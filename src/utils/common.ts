// 计算两数相除，有小数的话保留 2位
export const divide = (num1: number, num2: number) => {
  const result = num1 / num2
  return Number.isInteger(result) ? result : result.toFixed(2)
}

export const calcRate = (num1: number, num2: number) => {
  return divide(num1 * 100, num2) + '%'
}

export const randomNumber = (minNumber: number, maxNumber: number) => {
  return Math.floor(Math.random() * maxNumber) + minNumber
}
