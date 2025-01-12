<script setup lang="ts">
import {
  type ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  useVueTable
} from '@tanstack/vue-table'
import type { DataTableItem } from '../types/DataTableItem.ts'
import type { DataTableResponseType } from '../types/DataTableResponseType.ts'
import { computed } from 'vue'

const props = defineProps<{
  data: DataTableResponseType
}>()

const columnHelper = createColumnHelper<DataTableItem>()

const columns = computed((): ColumnDef<DataTableItem, any>[] =>
  props.data.headers.map(header =>
    columnHelper.accessor(header.toLowerCase() as keyof DataTableItem, {
      header
    })
  )
)

const table = useVueTable({
  data: props.data.data,
  columns,
  getCoreRowModel: getCoreRowModel()
})
</script>

<template>
  <div>
    <table class="text-text-grey">
      <thead class="bg-bg-input">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-nowrap" v-for="header in props.data.headers" :key="header">
          {{ header }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="n in data.data.length / data.headers.length" :key="n">
        <td class="px-6 py-3 text-left text-sm text-nowrap" v-for="(header, i) in data.headers" :key="header">
          {{ data.data[(n-1) * data.headers.length + i]?.derivedValue || 'null' }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
