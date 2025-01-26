<script setup lang="ts">
import { ref } from 'vue'

const increments = ["10,000", "5,000", "500", "250"]
const selectedIncrement = ref("250")
const showIncrements = ref(false)

const emit = defineEmits<{
  (e: 'download', increment: string): void
}>()

const handleDownload = () => {
  // Emit the selected increment to parent
  emit('download', selectedIncrement.value)
}
</script>

<template>
  <div class="relative flex flex-col mx-3 h-min select-none">
    <div
      v-if="showIncrements"
      class="absolute bottom-[58px] w-[289px] stroke-line-input border border-b-0 border-line-input rounded-t-lg transition-transform duration-100"
      :class="showIncrements ? 'translate-y-0' : 'translate-y-8'"
    >
      <div
        v-for="increment in increments"
        @click="selectedIncrement = increment; showIncrements = false"
        class="flex justify-between items-center text-sm border-b border-line pr-4 py-1 cursor-pointer hover:bg-bg-lighter"
        :class="selectedIncrement === increment ? 'text-accent-pink' : 'text-text-grey'"
      >
        <span class="w-[138px] text-right ml-3">{{increment}}</span>
        <span class="absolute right-[100px] text-xl font-bold" v-if="selectedIncrement === increment">✓</span>
      </div>
    </div>

    <div @click="showIncrements = !showIncrements" class="relative flex place-items-center text-right bg-bg-input border border-b-0 border-line-input text-accent-pink text-sm rounded-t-md cursor-pointer hover:bg-line">
      <div class="grow font-bold py-1">
        {{ selectedIncrement }}
      </div>
      <svg class="ml-[97px] mr-6" width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.93099 12.7355C4.57041 13.0871 3.98484 13.0871 3.62426 12.7355L0.855027 10.0355C0.49445 9.68397 0.49445 9.11303 0.855027 8.76146C1.2156 8.4099 1.80118 8.4099 2.16176 8.76146L3.35599 9.92584V1.2999C3.35599 0.80209 3.76849 0.399902 4.27907 0.399902C4.78964 0.399902 5.20214 0.80209 5.20214 1.2999V9.92584L6.39637 8.76146C6.75695 8.4099 7.34253 8.4099 7.70311 8.76146C8.06368 9.11303 8.06368 9.68397 7.70311 10.0355L4.93387 12.7355H4.93099ZM15.0848 3.36147C15.4454 3.71303 15.4454 4.28397 15.0848 4.63553C14.7243 4.98709 14.1387 4.98709 13.7781 4.63553L12.5868 3.47397V12.0999C12.5868 12.5977 12.1743 12.9999 11.6637 12.9999C11.1531 12.9999 10.7406 12.5977 10.7406 12.0999V3.47397L9.54637 4.63834C9.1858 4.9899 8.60022 4.9899 8.23964 4.63834C7.87907 4.28678 7.87907 3.71584 8.23964 3.36428L11.0089 0.664277C11.3695 0.312715 11.955 0.312715 12.3156 0.664277L15.0848 3.36428V3.36147Z" fill="#F75590"/>
      </svg>
    </div>

    <div
      @click="handleDownload"
      class="px-6 pt-1 pb-1.5 flex place-items-center font-bold text-sm bg-accent-pink text-white rounded-b-md text-nowrap cursor-pointer hover:bg-pink-600 transition-colors"
    >
      Download <span class="w-[73px] text-right pr-3 underline">{{ selectedIncrement }}</span> rows of data
    </div>
  </div>
</template>
