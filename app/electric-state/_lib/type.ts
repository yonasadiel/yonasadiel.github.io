export const DM_NAME = 'DM'

export type SessionData = {
  title: string
  backgroundImage: string
  story: StoryChapter[]
  travelers: Traveler[]
  maps: Map[]
  combat?: Combat // only populated during combat mode
}

export type StoryChapter = {
  title: string
  story: string
}

export type Traveler = {
  name: string
  archetype: string
  talents: Talent[]
  dream: string
  flaw: string
  neurocaster: Neurocaster
  personalItem: Item[]
  stats: Stats
  state: TravelerState
}

export type Stats = {
  str: number
  agi: number
  wit: number
  emp: number
}

export type TravelerState = {
  cash: number
  health: number
  hope: number
  bliss: number
  tensions: Record<string, Tension>
  statsModifier: Stats
}

export type Talent = {
  title: string
  description: string
}

export type Neurocaster = {
  name: string
  processor: number
  network: number
  graphics: number
  price: number
  mobility: number
}

export type Item = Gear | Weapon | Armor

export type Gear = {
  name: string
  type: 'gear'
  bonus?: number // not all gear give bonuses
  used?: number // not all gear needs to track number of uses
  description: string
  price: number
}

export type Weapon = {
  name: string
  type: 'weapon'
  bonus: number
  damage: number
  minRange: 'Engaged' | 'Short' | 'Medium' | 'Long'
  maxRange: 'Engaged' | 'Short' | 'Medium' | 'Long'
  price: number
}

export type Armor = {
  name: string
  type: 'armor'
  level: number
  agilityModifier: number
  prioce: number
}

export type Tension = {
  level: number
  description: string
}

export type Map = {
  title: string
  url: string
  maxY: number
  pois: POI[]
}

export type POI = {
  name: string
  x: number
  y: number
}

export type Combat = {
  active: boolean // don't show combat page if false
  currentTurn: string // the name of the Turn
  map: CombatMap
  turns: Turn[]
}

export type CombatMap = {
  url: string
  offsetX: number // all positions of the Turn needs to be offseted using this pixel. Treat it as the percentage of the image width
  offsetY: number // all positions of the Turn needs to be offseted using this pixel. Treat it as the percentage of the image height
  gridX: number // number of squares horizontally
  gridY: number // number of squares vertically
}

export type Turn = {
  name: string
  state: 'alive' | 'incapacitated' | 'dead'
  initiative: number // determining the turn order. Can be assumed unique, no need for tie breaker
  deathRollFailedCount: number // 0 - 2, 3 means dead
  deathRollSucceedCount: number // number of 6's of death rolls
  posX: number // based on the map grid, this is the square number of the turn taker, horizontally, from the bottom left
  posY: number // based on the map grid, this is the square number of the turn taker, vertically, from the bottom left
}
