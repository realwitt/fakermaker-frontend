<script setup lang="ts">

const props = defineProps<{
  configTitle?: string
  configNickname?: string
}>()
const emits = defineEmits<{
  (event: 'selected', items: Array<string>): void
}>()

</script>

<template>
 <div class="text">
    {{props.configTitle}}
 </div>
</template>
