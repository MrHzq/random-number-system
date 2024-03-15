<script setup lang="ts"></script>

<template>
  <div class="flex">
    <div><slot name="title">title</slot></div>
    <div>
      <slot name="split">：</slot>
    </div>
    <div>
      <slot name="content">content</slot>
    </div>
  </div>
</template>
