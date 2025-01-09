type MakerConfig = {
  type: string
  title: string
  nickname?: string
  id?: string
  options?: {
    nullable?: boolean
    format?: string
    variants?: string[]
  }
}
