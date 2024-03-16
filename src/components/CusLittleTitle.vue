<template>
  <div class="flex">
    <div class="flex-none select-all">
      <slot name="title"> {{ "<template #title>title</template>" }} </slot>
    </div>
    <div>
      <slot name="split">：</slot>
    </div>
    <div class="select-all">
      <slot name="content"> {{ "<template #content>content</template>" }}</slot>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
