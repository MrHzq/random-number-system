<template>
  <main class="flex justify-center items-center flex-col px-[20px] gap-4">
    <div class="text-xl text-sky-500">欢迎使用 random-number-system</div>
    <p class="text-gray-500 text-sm">
      它可以自动生成给定范围内的随机正整数，可用帮你打乱顺序记东西：比如记英语单词~
    </p>
    <el-button @click="handleClick" class="mt-4" type="primary"> 开始使用 </el-button>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleClick = () => {
  router.push('/random')
}
</script>
