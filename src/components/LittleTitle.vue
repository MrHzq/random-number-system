<template>
  <div class="flex">
    <div>
      <slot name="title"> {{ "<template #title>title</template>" }} </slot>
    </div>
    <div>
      <slot name="split">：</slot>
    </div>
    <div>
      <slot name="content"> {{ "<template #content>content</template>" }}</slot>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
