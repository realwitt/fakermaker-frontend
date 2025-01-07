<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  configTitle?: string
  configNickname?: string
}>()
const emits = defineEmits<{
  (event: 'selected', items: Array<string>): void
}>()

const nickName = ref<string>('')
const isFocused = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

</script>

<template>
  <div class="group relative max-w-[250px]">

    <div class="text-accent-purple text-[13px] pl-3.5 mb-1">
      First Name
    </div>

    <div class="overflow-hidden px-[1px] py-[1px] rounded-t-[7px] relative z-20">
      <div class="relative">
        <!-- Input field container -->
        <div
          class="relative z-10 min-h-10 w-full px-3 py-2 rounded-t-md bg-bg-input cursor-text"
          @mousedown="$event.target === $event.currentTarget && (() => {
            $event.preventDefault();
            !isFocused && inputRef?.focus()
          })()"
        >
          <input
            ref="inputRef"
            class="w-full bg-transparent text-text-grey focus:outline-none caret-accent-pink placeholder-text-grey"
            :placeholder="configTitle || 'Enter text...'"
            v-model="nickName"
            @focus="isFocused = true"
            @blur="isFocused = false"
          />
        </div>

        <!-- Animated borders -->
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
