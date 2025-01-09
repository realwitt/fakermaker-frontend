export type MakerConfigType = {
  type: MakerEnum
  title: string
  nickname?: string
  id?: string
  options?: {
    nullable?: boolean
    format?: string
    variants?: string[]
  }
}

export type MakerEnum =
  "Back to the Future" |
  "Baseball" |
  "Basketball" |
  "Breaking Bad" |
  "Call of Duty" |
  "Clash of Clans" |
  "Doctor Who" |
  "Game of Thrones" |
  "Gravity Falls" |
  "Harry Potter" |
  "How to Train Your Dragon" |
  "Idiocracy" |
  "Indiana Jones" |
  "Iron Man" |
  "Jurassic Park" |
  "King of the Hill" |
  "Lord of the Rings" |
  "Monk" |
  "Nacho Libre" |
  "Parks and Recreation" |
  "Pirates of the Caribbean" |
  "Pokemon" |
  "Rango" |
  "Rick and Morty" |
  "Silicon Valley" |
  "Star Wars" |
  "Tech" |
  "The Hobbit" |
  "The Office" |
  "Throne of Glass" |
  "Toy Story" |
  "Transformers"
