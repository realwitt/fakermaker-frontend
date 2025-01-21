<script setup lang="ts">
import { ref } from 'vue'

const search = ref()
const isFocused = ref(false)
const inputRef = ref<HTMLInputElement | null>()
const isCollapsed = ref(false)  // track if menu is collapsed or not

</script>

<template>
  <div
    class="flex flex-shrink-0 bg-bg grow h-full transition-[max-width] duration-100 ease-out"
    :class="[isCollapsed ? 'max-w-[102px]' : 'max-w-[310px]']"
  >
    <!-- holds all the good stuff -->
    <div class="grow h-full bg-bg z-20">

      <div class="overflow-hidden py-[1px] relative mt-11">
        <div class="relative">
          <div
            class="relative z-10 min-h-10 w-full px-3 py-2 bg-bg-input cursor-text"
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
              placeholder="Search fakers..."
              v-model="search"
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

      <div class="relative bg-cover bg-center h-[50px]"
           style="background-image: url('/src/assets/lotr-background.png')">
        <div class="absolute right-0 h-full w-[130px] bg-gradient-to-r from-transparent to-[#212738]" />
        <div class="text-white font-black text-md text-right pt-5 pr-3 relative z-10 drop-shadow-[0_0_14.1px_rgba(255,255,255,0.5)] transition-opacity duration-100 ease-out"
             :class="[isCollapsed ? 'opacity-0' : 'opacity-100']">
          Lord of the Rings
        </div>
      </div>

    </div>


    <div
      class="w-5 h-full bg-bg border-accent-pink border-l [box-shadow:-14px_0_25px_0_#BDB2FF] z-[10] cursor-pointer flex-shrink-0 group hover:bg-bg-slightly-lighter duration-100"
      @click="isCollapsed = !isCollapsed"
    >
      <div class="mt-32 text-text-muted flex-col space-y-1.5">
    <span class="inline-block ml-[3px] text-xl group-hover:text-text-grey">
      {{ isCollapsed ? '→' : '←' }}
    </span>
        <span class="[writing-mode:vertical-lr] text-xs tracking-wider pl-[1px] group-hover:text-text-grey">
      {{ isCollapsed ? 'expand' : 'collapse' }}
    </span>
      </div>
    </div>
  </div>
</template>
