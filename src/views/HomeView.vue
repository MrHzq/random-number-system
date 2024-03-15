<script setup lang="ts">
import MyButton from '@/components/MyButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleClick = () => {
  router.push('/random')
}
</script>

<template>
  <main class="flex justify-center items-center flex-col">
    <div class="text-xl">welcome in random-number-system</div>
    <MyButton @click="handleClick" class="mt-4"> 开始使用 </MyButton>
  </main>
</template>
