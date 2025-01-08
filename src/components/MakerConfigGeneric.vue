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
const isNullable = ref(false)

</script>

<template>
  <div class=" group relative inline-block">

    <div class="flex justify-between w-full -mb-0.5">
      <div class="text-accent-purple text-[13px] pl-3.5 pb-1">
        First Name
      </div>
      <div class="relative cursor-pointer" @click="isNullable = !isNullable">
        <div
          :class="[
    'absolute transition duration-100 text-[11px] font-semibold select-none',
    'border border-b-0 pt-1 pb-1 px-3 mr-[34px]', 'rounded-t-md -translate-x-full -left-[34px] bottom-[1px]',
    isNullable
      ? 'text-accent-pink border-accent-purple'
      : [
          'text-text-muted border-text-muted',
          'hover:text-text-grey hover:border-accent-pink'
        ]
    ]"
        >
          nullable
        </div>
      </div>
    </div>

    <div class="overflow-hidden px-[1px] py-[1px] rounded-tl-[7px] relative z-20 flex">
      <div class="relative flex-1">
        <!-- Input field container -->
        <div
          class="relative z-10 min-h-10 w-full px-3 py-2 rounded-tl-md bg-bg-input cursor-text"
          @mousedown="$event.target === $event.currentTarget && (() => {
            $event.preventDefault();
            !isFocused && inputRef?.focus()
          })()"
        >
          <input
            ref="inputRef"
            class="w-full bg-transparent focus:outline-none caret-accent-pink placeholder-text-grey text-text-grey"
            :placeholder="configTitle || 'Enter text...'"
            v-model="nickName"
            @focus="isFocused = true"
            @blur="isFocused = false"
          />
        </div>

        <!-- Animated borders -->
        <div
          class="absolute inset-x-0 -top-[1px] h-[3px] w-0 overflow-hidden bg-accent-pink origin-left transition-all duration-100 ease-out group-focus-within:w-full"></div>
        <div
          class="absolute -left-[1px] -top-[1px] w-[3px] h-0 overflow-hidden bg-accent-pink origin-top transition-all duration-100 ease-out group-focus-within:h-[calc(100%+2px)]"></div>
        <div
          class="absolute -right-[1px] -top-[1px] w-[3px] h-0 overflow-hidden bg-accent-pink origin-top transition-all duration-100 delay-100 ease-out group-focus-within:h-[calc(100%+2px)]"></div>
        <div class="absolute -bottom-[1px] left-0 h-[1px] w-full bg-accent-pink"></div>
        <div
          class="absolute -bottom-[1px] left-0 h-[1px] w-0 bg-rose-600 origin-left transition-all duration-100 ease-out group-hover:w-full"></div>
        <div
          class="absolute -bottom-[1px] left-0 h-[1px] w-0 bg-accent-pink origin-left transition-all duration-100 delay-100 ease-out group-focus-within:w-full z-10"></div>
      </div>
      <div
        class="cursor-pointer select-none hover:border-accent-pink hover:text-accent-pink transition duration-100 text-text-muted px-2.5 -mb-[1px] -mt-[1px] font-bold text-xl flex items-center border border-text-muted rounded-r-md">
        ✗
      </div>
    </div>
  </div>
</template>
