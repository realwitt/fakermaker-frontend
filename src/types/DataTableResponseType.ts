import type { DataTableItem } from './DataTableItem.ts'

export type DataTableResponseType = {
  headers: string[]
  data: Array<Record<string, DataTableItem>>
}
