<template>
  <main class="flex justify-center items-center flex-col">
    <div class="text-xl">welcome in random-number-system</div>
    <Button @click="handleClick" class="mt-4"> 开始使用 </Button>
  </main>
</template>

<script setup lang="ts">
import Button from '@/components/Button.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleClick = () => {
  router.push('/random')
}
</script>
