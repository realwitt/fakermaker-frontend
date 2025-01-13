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
import { useVirtualizer, type VirtualizerOptions } from '@tanstack/vue-virtual'

type TooltipPosition = {
  x: number
  y: number
  xOffset: number
}

const props = defineProps<{
  data: DataTableResponseType
}>()

const tableContainerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement>()
const showTooltip = ref(false)
const tooltipPosition = ref<TooltipPosition>({
  x: 0,
  y: 0,
  xOffset: -50
})
const activeCell = ref<DataTableItem>()
const columnHelper = createColumnHelper<DataTableItem>()


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
  activeCell.value = undefined
}

function handleClick(cellData: DataTableItem) {
  if (cellData?.wikiUrl) {
    window.open(cellData.wikiUrl, '_blank')
  }
}

function measureElement(el?: Element) {
  if (!el) {
    return
  }
  rowVirtualizer.value.measureElement(el)
  return undefined
}

const rowVirtualizerOptions = computed(() => {
    return {
      count: props.data.data.length / props.data.headers.length,
      estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
      getScrollElement: () => tableContainerRef.value,
      overscan: 5
    }
  }
)
const rowVirtualizer = useVirtualizer(rowVirtualizerOptions)

const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())
const totalSize = computed(() => rowVirtualizer.value.getTotalSize())


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
const { rows } = table.getRowModel()
</script>

<!-- for virt content Tr: -->
<!--:style="{-->
<!--position: 'absolute',-->
<!--top: 0,-->
<!--left: 0,-->
<!--width: '100%',-->
<!--height: `${virtualRow.size}px`,-->
<!--transform: `translateY(${virtualRow.start}px)`,-->
<!--}"-->


<template>
  <div
    ref="parentRef"
    class="overflow-auto"
    style="height: 500px; width: 100%"
  >
    <!-- Table container to maintain consistent widths -->
    <div class="relative">
      <!-- Fixed header table -->
      <table class="text-text-grey w-full min-w-full">
        <colgroup>
          <col v-for="header in props.data.headers" :key="header" class="w-auto" />
        </colgroup>
        <thead class="text-accent-pink font-bold sticky top-0 bg-bg z-20">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium capitalize tracking-wider text-nowrap border-b border-line"
            v-for="header in props.data.headers"
            :key="header"
          >
            {{ header }}
          </th>
        </tr>
        </thead>
      </table>

      <!-- Virtualized content -->
      <div
        :style="{
          height: `${totalSize}px`,
          width: '100%',
          position: 'relative',
        }"
      >
        <table class="w-full min-w-full">
          <colgroup>
            <col v-for="header in props.data.headers" :key="header" class="w-auto" />
          </colgroup>
          <tbody
            :style="{
            display: 'grid',
            height: `${totalSize}px`, //tells scrollbar how big the table is
            position: 'relative', //needed for absolute positioning of rows
          }">
          <tr
            v-for="vRow in virtualRows"
            :key="vRow.index"
            :ref="measureElement"
            :style="{
              display: 'flex',
              position: 'absolute',
              transform: `translateY(${vRow.start}px)`, //this should always be a `style` as it changes on scroll
              width: '100%',
            }"
            class="hover:bg-bg-slightly-lighter"
          >
            <td
              v-for="(header, i) in data.headers"
              :key="header"
              class="bg-orange-400 px-6 py-2 text-left text-sm text-nowrap border-y border-line relative hover:bg-bg-input hover:z-10 cursor-pointer group/cell"
              @mouseenter="handleMouseEnter($event, data.data[vRow.index * data.headers.length + i])"
              @mousemove="handleMouseMove"
              @mouseleave="handleMouseLeave"
              @click="handleClick(data.data[vRow.index * data.headers.length + i])"
            >
              {{ data.data[vRow.index * data.headers.length + i]?.derivedValue || 'null' }}
              <!-- Animated borders -->
              <div
                class="absolute inset-x-0 -top-[1px] h-[1px] w-0 overflow-hidden bg-accent-pink origin-left transition-all duration-150 ease-out group-hover/cell:w-full z-20"></div>
              <div
                class="absolute -left-[1px] -top-[1px] w-[1px] h-0 overflow-hidden bg-accent-pink origin-top transition-all duration-150 ease-out group-hover/cell:h-[calc(100%+2px)] z-20"></div>
              <div
                class="absolute -right-[1px] -top-[1px] w-[1px] h-0 overflow-hidden bg-accent-pink origin-top transition-all duration-150 delay-150 ease-out group-hover/cell:h-[calc(100%+2px)] z-20"></div>
              <div
                class="absolute -bottom-[1px] left-0 h-[1px] w-0 overflow-hidden bg-accent-pink origin-left transition-all duration-150 delay-150 ease-out group-hover/cell:w-full z-20"></div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
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
          {{ activeCell.originalValue }}
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
