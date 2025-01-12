// Enums to match Kotlin enums
// import type { MakerEnums } from './enums/MakerEnums.ts'

// enum MakerEnum {
//   NAME_FIRST = 'NAME_FIRST',
//   // Add other enum values as needed
// }

// enum FakerEnum {
//   TECH = 'TECH',
//   // Add other enum values as needed
// }

// enum StatesEnum {
//   AR = 'AR',
//   // Add other enum values as needed
// }

// enum IdTypeEnum {
//   UUID = 'UUID',
//   // Add other enum values as needed
// }

// Discriminated union for Influencer
// type Influencer =
//   | { type: 'State'; state: StatesEnum }
//   | { type: 'City'; city: string }
//   | { type: 'Zip'; zip: string }
//   | { type: 'AreaCode'; areaCode: string };

// Main DataTableItem type
export type DataTableItem = {
  maker?: string
  fakersUsed?: string[] // FakerEnum[]
  originalValue?: string
  derivedValue: string
  wikiUrl?: string
  influencedBy?: object[] // Influencer[];
  idTypeEnum?: string  // IdTypeEnum;
  nickname: string
}
