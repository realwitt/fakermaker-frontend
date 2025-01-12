<script setup lang="ts">
import {
  type ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  useVueTable
} from '@tanstack/vue-table'
import type { DataTableItem } from '../types/DataTableItem.ts'
import type { DataTableResponseType } from '../types/DataTableResponseType.ts'
import { computed, ref } from 'vue'

type TooltipPosition = {
  x: number
  y: number
  xOffset: number
}

const props = defineProps<{
  data: DataTableResponseType
}>()

const tooltipRef = ref<HTMLElement | null>(null)
const showTooltip = ref(false)
const tooltipPosition = ref<TooltipPosition>({
  x: 0,
  y: 0,
  // todo: this isn't working rn
  xOffset: -50
})
const activeCell = ref<DataTableItem | null>(null)

function handleMouseEnter(event: MouseEvent, cellData: DataTableItem) {
  setTooltipPosition(event)
  activeCell.value = cellData
  showTooltip.value = true
}

function handleMouseMove(event: MouseEvent) {
  if (showTooltip.value) {
    setTooltipPosition(event)
  }
}

function setTooltipPosition(event: MouseEvent) {
  const SCREEN_PADDING = 20
  const viewportWidth = window.innerWidth
  const tooltipWidth = tooltipRef.value?.offsetWidth || 0

  let xOffset = -50 // Default center positioning

  // Left edge detection
  if (event.clientX < tooltipWidth / 2 + SCREEN_PADDING) {
    const distanceFromEdge = event.clientX - SCREEN_PADDING
    const percentageFromCenter = (distanceFromEdge / (tooltipWidth / 2)) * 50
    xOffset = -percentageFromCenter
  }
  // Right edge detection
  else if (event.clientX > viewportWidth - tooltipWidth / 2 - SCREEN_PADDING) {
    const distanceFromEdge = viewportWidth - event.clientX - SCREEN_PADDING
    const percentageFromCenter = (distanceFromEdge / (tooltipWidth / 2)) * 50
    xOffset = -(100 - percentageFromCenter)
  }

  tooltipPosition.value = {
    x: event.clientX,  // Always keep at cursor position
    y: event.clientY,
    xOffset
  }
}

function handleMouseLeave() {
  showTooltip.value = false
  activeCell.value = null
}

function handleClick(cellData: DataTableItem) {
  if (cellData?.wikiUrl) {
    window.open(cellData.wikiUrl, '_blank')
  }
}

const columnHelper = createColumnHelper<DataTableItem>()

// dynamically generate headers since they can change each time
const columns = computed((): ColumnDef<DataTableItem, any>[] =>
  props.data.headers.map(header =>
    columnHelper.accessor(header.toLowerCase() as keyof DataTableItem, {
      header
    })
  )
)

const table = useVueTable({
  data: props.data.data,
  columns: columns.value,
  getCoreRowModel: getCoreRowModel()
})
</script>

<template>
  <div class="overflow-x-auto">
    <table class="text-text-grey w-full min-w-full">
      <thead class="text-accent-pink font-bold">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium capitalize tracking-wider text-nowrap" v-for="header in props.data.headers" :key="header">
          {{ header }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr class="hover:bg-bg-slightly-lighter" v-for="n in data.data.length / data.headers.length" :key="n">
        <td class="px-6 py-2 text-left text-sm text-nowrap border-y border-line relative hover:outline hover:outline-1 hover:outline-accent-pink hover:bg-bg-input hover:z-10 cursor-pointer"
            v-for="(header, i) in data.headers"
            :key="header"
            @mouseenter="handleMouseEnter($event, data.data[(n-1) * data.headers.length + i])"
            @mousemove="handleMouseMove"
            @mouseleave="handleMouseLeave"
            @click="handleClick(data.data[(n-1) * data.headers.length + i])"
        >
          {{ data.data[(n-1) * data.headers.length + i]?.derivedValue || 'null' }}
        </td>
      </tr>
      </tbody>
    </table>
    <div v-if="showTooltip && activeCell"
         ref="tooltipRef"
         class="fixed z-50 bg-bg border border-line rounded p-4 shadow-lg whitespace-nowrap w-max"
         :style="{
       left: `${tooltipPosition.x}px`,
       top: `${tooltipPosition.y}px`,
       transform: `translate(${tooltipPosition.xOffset}%, -100%) translateY(-50px)` // translate full height, plus pixel amount
     }"
    >
      <div v-if="activeCell.fakersUsed && activeCell.fakersUsed.length > 0">
        <div class="text-text-muted text-xs font-medium mb-1">Fakers Used:</div>
        <ul class="list-disc list-inside mb-3 text-accent-purple text-sm">
          <li v-for="faker in activeCell.fakersUsed" :key="faker">{{ faker }}</li>
        </ul>
      </div>

      <!-- todo: add influencedBy to hover div to show where the values came from -->

      <div v-if="activeCell.originalValue && activeCell.originalValue.length > 0">
        <div class="text-text-muted text-xs font-medium mb-1">Original Value</div>
        <div class="list-disc list-inside mb-3 text-accent-purple text-sm">
          {{activeCell.originalValue}}
        </div>
      </div>

      <div v-if="activeCell.wikiUrl">
        <div class="text-text-muted text-xs font-medium mb-1">Wiki URL:</div>
        <a :href="activeCell.wikiUrl"
           target="_blank"
           class=" mb-3 text-accent-purple text-sm"
        >
          {{ activeCell.wikiUrl }}
        </a>
      </div>
    </div>
  </div>
</template>
