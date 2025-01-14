<script setup lang="ts">
import { computed, ref, h } from 'vue'
import {
  type ColumnDef,
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  FlexRender
} from '@tanstack/vue-table'
import { useVirtualizer } from '@tanstack/vue-virtual'
import type { DataTableItem } from '../types/DataTableItem.ts'
import type { DataTableResponseType } from '../types/DataTableResponseType.ts'

const search = ref('')

const props = defineProps<{
  data: DataTableResponseType
}>()

// const data = ref<DataTableItem[]>(props.data.data)
const data = ref<Record<string, DataTableItem>[]>(props.data.data)

const filteredData = computed(() => {
  const searchValue = search.value.toLowerCase()

  // If no search value is present, return all data
  if (!searchValue) return data.value

  return data.value.filter(row => {
    // Search through all DataTableItem properties in each row
    return Object.entries(row).some(([_, item]) => {
      if (!item) return false

      // Check the relevant fields of DataTableItem
      return [
        item.derivedValue,
        // search for a name, the name will show up even if only the first or last name got used
        item.originalValue
      ].some(value =>
        value?.toString().toLowerCase().includes(searchValue)
      )
    })
  })
})

let searchTimeout: ReturnType<typeof setTimeout>

function handleDebounceSearch(ev: Event) {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    search.value = (ev?.target as HTMLInputElement)?.value ?? ''
  }, 300)
}

const tooltipRef = ref<HTMLElement>()
const showTooltip = ref(false)
const tooltipPosition = ref({
  x: 0,
  y: 0,
  xOffset: -50
})
const activeCell = ref<DataTableItem>()

// Add these event handlers
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

function handleMouseLeave() {
  showTooltip.value = false
  activeCell.value = undefined
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
    x: event.clientX,
    y: event.clientY,
    xOffset
  }
}

function handleClick(cellData: DataTableItem) {
  if (cellData?.wikiUrl) {
    window.open(cellData.wikiUrl, '_blank')
  }
}

const columns = computed<ColumnDef<Record<string, DataTableItem>>[]>(() =>
  props.data.headers.map(header => ({
    accessorKey: header,
    header: header,
    cell: ({ row }) => {
      const item = row.original[header]
      return h('div', {
        class: 'relative group/cell w-full px-6 py-2 text-left text-sm text-nowrap border-y border-line hover:bg-bg-input hover:z-10 cursor-pointer',
        onMouseenter: (event) => handleMouseEnter(event, item),
        onMousemove: handleMouseMove,
        onMouseleave: handleMouseLeave,
        onClick: () => handleClick(item),
      }, [
        // Content
        item?.derivedValue,
        // Border animations
        h('div', {
          class: 'absolute inset-x-0 -top-[1px] h-[1px] w-0 overflow-hidden bg-accent-pink origin-left transition-all duration-150 ease-out group-hover/cell:w-full z-20'
        }),
        h('div', {
          class: 'absolute -left-[1px] -top-[1px] w-[1px] h-0 overflow-hidden bg-accent-pink origin-top transition-all duration-150 ease-out group-hover/cell:h-[calc(100%+2px)] z-20'
        }),
        h('div', {
          class: 'absolute -right-[1px] -top-[1px] w-[1px] h-0 overflow-hidden bg-accent-pink origin-top transition-all duration-150 delay-150 ease-out group-hover/cell:h-[calc(100%+2px)] z-20'
        }),
        h('div', {
          class: 'absolute -bottom-[1px] left-0 h-[1px] w-0 overflow-hidden bg-accent-pink origin-left transition-all duration-150 delay-150 ease-out group-hover/cell:w-full z-20'
        })
      ])
    },
    accessorFn: (row: Record<string, DataTableItem>) => row[header]?.derivedValue,
    enableResizing: true,
    size: header.toLowerCase() === 'company name' ? 350 : // Company name gets more space
      header.toLowerCase() === 'email' ? 250 : // Email still needs decent space
        150, // Other columns get less space
    minSize: 100,
  }))
)

const columnSizing = ref({})
const table = useVueTable<Record<string, DataTableItem>>({
  get data() {
    return filteredData.value
  },
  columns: columns.value,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  columnResizeMode: 'onChange',
  enableColumnResizing: true,
  defaultColumn: {
    size: 200,
    minSize: 100,
    maxSize: 500
  },
  state: {
    columnSizing: columnSizing.value
  },
  onColumnSizingChange: updater => {
    columnSizing.value = updater instanceof Function ? updater(columnSizing.value) : updater
  }
})

const rows = computed(() => table.getRowModel().rows)

//The virtualizer needs to know the scrollable container element
const tableContainerRef = ref<HTMLDivElement | null>(null)

const rowVirtualizerOptions = computed(() => {
  return {
    count: rows.value.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.value,
    overscan: 5
  }
})

const rowVirtualizer = useVirtualizer(rowVirtualizerOptions)

const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())

const totalSize = computed(() => rowVirtualizer.value.getTotalSize())

function measureElement(el?: Element) {
  if (!el) {
    return
  }

  rowVirtualizer.value.measureElement(el)

  return undefined
}
</script>


<template>
  <div>
    <p class="text-center">
      For tables, the basis for the offset of the translate css function is from
      the row's initial position itself. Because of this, we need to calculate
      the translateY pixel count different and base it off the the index.
    </p>
    <h1 class="text-3xl font-bold text-center">Virtualized Rows</h1>
    <div style="margin: 0 auto; width: min-content">
      <input
        :value="search"
        @input="handleDebounceSearch"
        placeholder="Search"
        class="p-2"
      />
      {{ rows.length.toLocaleString() }} results
    </div>
  </div>
  <div
    class="overflow-auto relative h-[800px] w-full"
    ref="tableContainerRef"
  >
      <table class="text-text-grey w-full">
        <thead
          :style="{
            display: 'grid',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }"
        >
        <tr
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
          class="flex w-full"
        >
          <!-- styling for headers -->
          <th
            v-for="header in headerGroup.headers"
            class="relative text-accent-pink text-left font-medium text-sm px-4 pb-2 bg-bg"
            :key="header.id"
            :colspan="header.colSpan"
            :style="{
              width: `${header.getSize()}px`,
            }"
          >
            <div
              v-if="!header.isPlaceholder"
              :class="{ 'cursor-pointer select-none': header.column.getCanSort(), }"
              @click="e => header.column.getToggleSortingHandler()?.(e)"
            >
              <FlexRender
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
              <span v-if="header.column.getIsSorted() === 'asc'"> 🔼</span>
              <span v-if="header.column.getIsSorted() === 'desc'"> 🔽</span>
            </div>
            <!-- for resizing -->
            <div
              v-if="header.column.getCanResize()"
              @mousedown="header.getResizeHandler()"
              @touchstart="header.getResizeHandler()"
              class="absolute right-0 top-0 h-full w-1 bg-gray-400/50 cursor-col-resize select-none touch-none hover:opacity-100 hover:bg-gray-400"
              :class="{ 'bg-gray-600 opacity-100': header.column.getIsResizing() }"
            />
          </th>
        </tr>
        </thead>
<!-- todo: tbody > tr > td is creating problems with that 1 pixel gap between elments... how to get rid of?? -->
        <tbody
          class="flex relative"
          :style="{
            height: `${totalSize}px`, //tells scrollbar how big the table is
          }"
        >
        <tr
          class="text-text-grey text-sm text-nowrap flex absolute w-full p-0 hover:bg-bg-slightly-lighter"
          v-for="vRow in virtualRows"
          :data-index="vRow.index"
          :ref="measureElement"
          :key="rows[vRow.index].id"
          :style="{
            transform: `translateY(${vRow.start}px)`
          }"
        >
          <!-- styling for cells -->
          <td
            class="h-full w-full p-0 m-0"
            v-for="cell in rows[vRow.index].getVisibleCells()"
            :key="cell.id"
            :style="{
                display: 'flex',
                width: `${cell.column.getSize()}px`,
              }"
          >
            <FlexRender
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
            />
          </td>
        </tr>
        </tbody>
      </table>
  </div>
  <!-- Tooltip -->
  <div v-if="showTooltip && activeCell"
       ref="tooltipRef"
       class="fixed z-50 bg-bg border border-line rounded p-4 shadow-lg whitespace-nowrap w-max"
       :style="{
         left: `${tooltipPosition.x}px`,
         top: `${tooltipPosition.y}px`,
         transform: `translate(${tooltipPosition.xOffset}%, -100%) translateY(-50px)`
       }"
  >
    <div v-if="activeCell.fakersUsed && activeCell.fakersUsed.length > 0">
      <div class="text-text-muted text-xs font-medium mb-1">Fakers Used:</div>
      <ul class="list-disc list-inside mb-3 text-accent-purple text-sm">
        <li v-for="faker in activeCell.fakersUsed" :key="faker">{{ faker }}</li>
      </ul>
    </div>

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
         class="mb-3 text-accent-purple text-sm"
      >
        {{ activeCell.wikiUrl }}
      </a>
    </div>
  </div>
</template>
