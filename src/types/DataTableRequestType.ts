import type { MakerConfigType } from './MakerConfigType.ts'

export type DataTableRequestType = {
  sessionID?: string,
  fakers: string[],
  makers: MakerConfigType[]
}
