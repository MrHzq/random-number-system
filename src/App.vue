<template>
  <div class="h-full flex flex-col">
    <header>
      <div class="wrapper">
        <nav class="flex gap-8 items-center justify-center">
          <RouterLink to="/" :class="RouterLinkClassName" :active-class="RouterLinkActiveClassName"
            >Home</RouterLink
          >
          <RouterLink
            to="/random"
            :class="RouterLinkClassName"
            :active-class="RouterLinkActiveClassName"
            >Random</RouterLink
          >
        </nav>
      </div>
    </header>

    <RouterView class="flex-1" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const RouterLinkClassName = ref(
  'h-10 flex items-center justify-center border-b-2 border-white hover:border-blue-500 hover:text-blue-500 transition-all'
)
const RouterLinkActiveClassName = ref('border-blue-500 text-blue-500')
</script>
