type MakerConfig = {
  id: string
  type: string
  title: string
  nickname?: string
  options?: {
    nullable?: boolean
    format?: string
    variants?: string[]
  }
}
