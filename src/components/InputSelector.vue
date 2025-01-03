<script setup lang="ts">
import { computed, ref, watch } from 'vue'
const props = defineProps<{
  itemNames?: Array<string>
  modelValue: Array<string>
}>()
const emits = defineEmits<{
  (event: 'update:modelValue', items: Array<string>): void
}>()

const isMakerSearchFocused = ref(false)
const searchTerm = ref('')
const selectedItems = ref<Array<string>>(props.modelValue)
const isBackspaceOnEmpty = ref(false)   // Tracks backspace state for deletion
const makerInput = ref<HTMLInputElement | null>(null)

const filteredItems = computed(() => {
  if (!props.itemNames) return ['']
  return props.itemNames.filter(item =>
    item.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

function updateSelected(items: Array<string>) {
  selectedItems.value = items
  emits('update:modelValue', items)
}

watch(() => props.modelValue, (newValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(selectedItems.value)) {
    selectedItems.value = [...newValue]
  }
}, { deep: true })

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Backspace' && !searchTerm.value) {
    e.preventDefault()
    if (isBackspaceOnEmpty.value && selectedItems.value.length > 0) {
      selectedItems.value.pop()
      isBackspaceOnEmpty.value = false
    } else {
      isBackspaceOnEmpty.value = true
    }
  } else {
    isBackspaceOnEmpty.value = false
  }
}

function selectItem(item: string) {
  const baseItemCount = selectedItems.value.filter(
    selectedItem => selectedItem.split(' (')[0] === item
  ).length

  const itemToAdd = baseItemCount > 0
    ? `${item} (${baseItemCount + 1})`
    : item

  updateSelected([...selectedItems.value, itemToAdd])
  searchTerm.value = ''
}


function removeItem(index: number) {
  const newItems = [...selectedItems.value]
  newItems.splice(index, 1)
  updateSelected(newItems)
}

</script>

<template>
  <div class="group relative max-w-[700px]">
    <div class="mt-8 overflow-hidden px-[1px] py-[1px] rounded-t-[7px] relative z-20">
      <div class="relative">

        <!-- pills and input -->
        <div
          class=" relative z-10 min-h-10 w-full px-3 pt-3 pb-3 rounded-t-md bg-bg-input flex flex-wrap gap-2 items-center cursor-text"
          @mousedown="$event.target === $event.currentTarget && (() => { $event.preventDefault(); !isMakerSearchFocused && makerInput?.focus() })()"
        >
          <!-- Pills for selected items -->
          <div
            v-for="(item, index) in selectedItems"
            :key="index"
            :class="[
                'bg-accent-pink text-white text-sm flex items-center rounded-full font-semibold overflow-hidden',
                { 'ring-2 ring-accent-purple -pr-2': isBackspaceOnEmpty && index === selectedItems.length - 1 }
              ]"
          >
            <span class="px-3 py-0.5">{{ item }}</span>
            <button
              @click="removeItem(index)"
              class="hover:bg-accent-purple px-2 py-0.5 h-full flex items-center transition-colors"
            >×</button>
          </div>
          <!-- Input field -->
          <input
            ref="makerInput"
            class="flex-grow bg-transparent text-text-grey focus:outline-none caret-accent-pink placeholder-text-grey min-w-[100px] h-full"
            :placeholder="selectedItems.length === 0 ? 'Search & select makers...' : ''"
            v-model="searchTerm"
            @keydown="handleKeydown"
            @focus="isMakerSearchFocused = true"
            @blur="isMakerSearchFocused = false"
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

    <!-- 1 pixel padding to the left to offset the collapsing of the borders among all the items -->
    <div class="pl-[1px] absolute top-full left-0 right-0 overflow-hidden pointer-events-none group-focus-within:pointer-events-auto">
      <div
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 -mt-[1px] w-full transition-transform duration-100 ease-in-out -translate-y-full group-focus-within:translate-y-0 group-focus-within:transition-[transform] group-focus-within:delay-100"
      >
        <div
          v-for="(name, i) in filteredItems"
          :key="i"
          class="group/item relative text-text-grey px-3 py-2 min-w-10 bg-bg-slightly-lighter border border-line -ml-[1px] -mt-[1px] hover:text-accent-pink duration-150 cursor-pointer"
          @mousedown.prevent="() => { selectItem(name); makerInput?.focus(); }"
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
