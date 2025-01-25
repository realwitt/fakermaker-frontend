<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emits = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const isInputFocused = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  emits('update:modelValue', target.value)
}
</script>

<template>
  <div class="group relative w-full bg-orange">
    <div class="overflow-hidden px-[1px] py-[1px] rounded-t-[7px] relative z-20">
      <div class="relative">

        <div
          class=" relative z-10 min-h-10 w-full px-3 pt-3 pb-3 rounded-t-md bg-bg-input flex flex-wrap gap-2 items-center cursor-text"
          @mousedown="$event.target === $event.currentTarget && (() => { $event.preventDefault(); !isInputFocused})()"
        >
          <!-- Input field -->
          <input
            ref="inputRef"
            class="flex-grow bg-transparent text-text-grey focus:outline-none caret-accent-pink placeholder-text-grey min-w-[100px] h-full"
            :placeholder="'Search here...'"
            :value="modelValue"
            @input="handleInput"
            @focus="isInputFocused = true"
            @blur="isInputFocused = false"
          />
        </div>

        <div class="absolute inset-x-0 -top-[1px] h-[3px] w-0 overflow-hidden bg-accent-pink origin-left transition-all duration-100 ease-out group-focus-within:w-full"></div>
        <div class="absolute -left-[1px] -top-[1px] w-[3px] h-0 overflow-hidden bg-accent-pink origin-top transition-all duration-100 ease-out group-focus-within:h-[calc(100%+2px)]"></div>
        <div class="absolute -right-[1px] -top-[1px] w-[3px] h-0 overflow-hidden bg-accent-pink origin-top transition-all duration-100 delay-100 ease-out group-focus-within:h-[calc(100%+2px)]"></div>
        <div class="absolute -bottom-[1px] left-0 h-[1px] w-full bg-accent-pink"></div>
        <div class="absolute -bottom-[1px] left-0 h-[1px] w-0 bg-accent-purple origin-left transition-all duration-100 ease-out group-hover:w-full"></div>
        <div class="absolute -bottom-[1px] left-0 h-[1px] w-0 bg-accent-pink origin-left transition-all duration-100 delay-100 ease-out group-focus-within:w-full z-10"></div>
      </div>
    </div>

  </div>
</template>
