<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FakerConfig } from '../types/FakerConfig.ts'

const props = defineProps<{
  isCollapsed: boolean
  fakerConfig: FakerConfig
}>()

const emit = defineEmits<{
  (e: 'fakerToggled', displayName: string, isSelected: boolean): void
}>()

const isChecked = ref(false)

const backgroundImageUrl = computed(() => {
  return `url('/${props.fakerConfig.fileName}')`
})

const toggleFaker = () => {
  isChecked.value = !isChecked.value
  emit('fakerToggled', props.fakerConfig.displayName, isChecked.value)
}
</script>

<template>
  <div
    class="group relative h-[50px] overflow-hidden cursor-pointer transition-all duration-300 ease-out"
    @click="toggleFaker"
  >
    <!-- Background and content -->
    <div
      class="absolute inset-0 bg-cover bg-center transition-all duration-100 ease-out"
      :class="[
        isChecked ? 'translate-x-[21px] opacity-100' : 'group-hover:opacity-100 opacity-30'
      ]"
      :style="{ backgroundImage: backgroundImageUrl }"
    />
    <div class="absolute right-0 h-full w-[200px] bg-gradient-to-r from-transparent/0 via-[#212738]/60 to-[#212738]" />
    <div
      class="select-none font-black text-md text-right pt-5 pr-3 relative z-10 transition-all duration-150 ease-out"
      :class="[
        props.isCollapsed ? 'opacity-0' : isChecked ? 'opacity-100' : 'opacity-80 group-hover:opacity-100',
        isChecked ? 'text-white' : 'text-white drop-shadow-[0_0_14.1px_rgba(255,255,255,0.5)]'
      ]"
    >
      {{props.fakerConfig.displayName}}
    </div>
    <div
      class="text-[30px] font-black text-white bg-accent-pink px-2 absolute left-0 top-0 h-[50px] transition-all duration-100 ease-out flex items-center z-20"
      :class="isChecked ? 'translate-x-0' : '-translate-x-full'"
    >
      ✓
    </div>

    <!-- Animated borders -->
    <div class="absolute inset-x-0 -top-0 h-[1px] w-0 bg-accent-pink origin-left transition-all duration-100 ease-out group-hover:w-full" />
    <div class="absolute bottom-0 left-0 h-[1px] w-0 bg-accent-pink origin-left transition-all duration-100 ease-out group-hover:w-full" />
  </div>
</template>
