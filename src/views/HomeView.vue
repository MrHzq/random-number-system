<template>
  <main class="flex justify-center items-center flex-col">
    <div class="text-xl">welcome in random-number-system</div>
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
