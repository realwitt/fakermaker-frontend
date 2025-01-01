<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  itemNames?: Array<string>
}>()

const searchTerm = ref()
</script>

<template>
  <div class="group">
    <div class="mt-8 overflow-hidden px-[1px] py-[1px] rounded-t-[7px] max-w-[701px] relative z-20">
      <div class="relative">
        <input
          class="relative z-10 h-9 w-full px-3 pb-5 pt-[22px] rounded-t-md text-text-grey focus:outline-none bg-bg-input caret-accent-pink placeholder-text-grey"
          placeholder="Select makers..."
          v-model="searchTerm"
        />
        <div class="absolute inset-x-0 -top-[1px] h-[3px] w-0 overflow-hidden bg-accent-pink origin-left transition-all duration-100 ease-out group-focus-within:w-full"></div>
        <div class="absolute -left-[1px] -top-[1px] w-[3px] h-0 overflow-hidden bg-accent-pink origin-top transition-all duration-100 ease-out group-focus-within:h-[calc(100%+2px)]"></div>
        <div class="absolute -right-[1px] -top-[1px] w-[3px] h-0 overflow-hidden bg-accent-pink origin-top transition-all duration-100 delay-100 ease-out group-focus-within:h-[calc(100%+2px)]"></div>
        <div class="absolute -bottom-[1px] left-0 h-[3px] w-full overflow-hidden bg-accent-pink"></div>
        <!--    <div class="absolute -bottom-[1px] left-0 h-[1px] w-0 bg-accent-pink origin-left transition-all duration-100 delay-100 ease-out group-focus-within:w-full"></div>-->
      </div>
    </div>

    <div class="ml-[1px] overflow-hidden">
      <div
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 -mt-[1px] max-w-[700px] relative z-10 transition-transform duration-100 ease-in-out -translate-y-full group-focus-within:translate-y-0 group-focus-within:transition-[transform] group-focus-within:delay-100"
      >
        <div
          v-for="(name, i) in props.itemNames"
          :key="i"
          class="group/item relative text-text-grey px-3 py-2 min-w-10 bg-bg-slightly-lighter border border-line -ml-[1px] -mt-[1px] hover:text-accent-pink duration-150 cursor-pointer"
        >
          {{name}}
          <div class="absolute inset-x-0 -top-[1px] h-[1px] w-0 overflow-hidden bg-accent-pink origin-left transition-all duration-150 ease-out group-hover/item:w-full z-20"></div>
          <div class="absolute -left-[1px] -top-[1px] w-[1px] h-0 overflow-hidden bg-accent-pink origin-top transition-all duration-150 ease-out group-hover/item:h-[calc(100%+2px)] z-20"></div>
          <div class="absolute -right-[1px] -top-[1px] w-[1px] h-0 overflow-hidden bg-accent-pink origin-top transition-all duration-150 delay-150 ease-out group-hover/item:h-[calc(100%+2px)] z-20"></div>
          <div class="absolute -bottom-[1px] left-0 h-[1px] w-0 overflow-hidden bg-accent-pink origin-left transition-all duration-150 delay-150 ease-out group-hover/item:w-full z-20"></div>
        </div>
      </div>
    </div>
  </div>
</template>
