<template>
  <div class="h-full flex items-center justify-center flex-col">
    <header class="w-full shadow">
      <div class="wrapper">
        <nav class="flex gap-8 items-center justify-center">
          <RouterLink to="/" :active-class="RouterLinkActiveClassName" :class="RouterLinkClassName"
            >首页</RouterLink
          >
          <RouterLink
            to="/random"
            :active-class="RouterLinkActiveClassName"
            :class="RouterLinkClassName"
          >
            使用
          </RouterLink>
        </nav>
      </div>
    </header>

    <div class="flex-1 w-full overflow-auto">
      <RouterView class="h-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const RouterLinkClassName = ref(
  'h-10 flex items-center justify-center border-b-2 border-white hover:border-blue-500 hover:text-blue-500 transition-all '
)
const RouterLinkActiveClassName = ref('!text-blue-500 !border-blue-500')
</script>
