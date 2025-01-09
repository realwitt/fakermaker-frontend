<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  makerConfig: MakerConfig
}>()
// const emits = defineEmits<{
//   (event: 'selected', items: Array<string>): void
// }>()

const nickName = ref<string>('')
const isFocused = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const isNullable = ref(false)
</script>

<template>
  <div class="group relative inline-block">
    <div class="flex justify-between w-full -mb-0.5">
      <div class="text-accent-purple text-[13px] pl-3.5 pb-1">
        {{makerConfig.title}}
      </div>
      <div class="relative cursor-pointer" @click="isNullable = !isNullable">
        <div
          :class="[
            'absolute transition duration-100 text-[11px] font-semibold select-none',
            'border border-b-0 pt-1 pb-1 px-3 mr-[34px]',
            'rounded-t-md -translate-x-full -left-[34px] bottom-[1px]',
            isNullable
              ? 'text-accent-pink border-accent-purple'
              : 'text-text-muted border-text-muted hover:text-text-grey hover:border-accent-pink',
          ]"
        >
          nullable
        </div>
      </div>
    </div>

    <div class="flex">
      <!-- Main content container -->
      <div class="flex-1">
        <!-- Input field section -->
        <div class="overflow-hidden px-[1px] py-[1px] rounded-tl-[7px] relative z-20">
          <div class="relative">
            <div
              class="relative z-10 min-h-10 w-full px-3 py-2 rounded-tl-md bg-bg-input cursor-text"
              @mousedown="
                $event.target === $event.currentTarget &&
                (() => {
                  $event.preventDefault()
                  !isFocused && inputRef?.focus()
                })()
              "
            >
              <input
                ref="inputRef"
                class="w-full bg-transparent focus:outline-none caret-accent-pink placeholder-text-muted text-text-grey"
                :placeholder="makerConfig.title || 'Enter text...'"
                v-model="nickName"
                @focus="isFocused = true"
                @blur="isFocused = false"
              />
            </div>

            <!-- Animated borders -->
            <div
              class="absolute inset-x-0 -top-[1px] h-[3px] w-0 overflow-hidden bg-accent-pink origin-left transition-all duration-100 ease-out group-focus-within:w-full"
            />
            <div
              class="absolute -left-[1px] -top-[1px] w-[3px] h-0 overflow-hidden bg-accent-pink origin-top transition-all duration-100 ease-out group-focus-within:h-[calc(100%+2px)]"
            />
            <div class="absolute -bottom-[1px] left-0 h-[1px] w-full bg-accent-pink" />
            <div
              class="absolute -bottom-[1px] left-0 h-[1px] w-0 bg-pink-400 origin-left transition-all duration-100 ease-out group-hover:w-full"
            />
            <div
              class="absolute -bottom-[1px] left-0 h-[1px] w-0 bg-accent-pink origin-left transition-all duration-100 delay-100 ease-out group-focus-within:w-full z-10"
            />
          </div>
        </div>

        <!-- Options section -->
        <div class="flex text-sm -mt-[1px] text-text-grey border border-text-muted border-t-0 rounded-bl-md">
          <div class="cursor-pointer select-none pt-1.5 pb-1 px-3 hover:text-accent-pink hover:bg-bg-slightly-lighter transition duration-100 rounded-bl-[5px]">JAN-01-2000</div>
          <div class="pt-1.5 pb-1 -mx-[4px]">|</div>
          <div class="cursor-pointer select-none pt-1.5 pb-1  px-3 hover:text-accent-pink hover:bg-bg-input transition duration-100">JAN-01-2000</div>
        </div>
      </div>

      <!-- X button container - now spans both sections -->
      <div
        class="flex items-stretch -ml-[1px]"
      >
        <div
          class="transition duration-100 text-text-muted px-2.5 font-bold text-xl flex items-center border border-text-muted rounded-r-md cursor-pointer select-none hover:border-accent-pink hover:text-accent-pink hover:bg-bg-slightly-lighter"
        >
          ✗
        </div>
      </div>
    </div>
  </div>
</template>
