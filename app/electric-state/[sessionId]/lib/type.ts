export type SessionData = {
  title: string
  backgroundImage: string
  story: StoryChapter[]
  travelers: Traveler[]
  maps: Map[]
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

export type Item = Gear | Weapon

export type Gear = {
  name: string
  type: 'gear'
  bonus: number
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

export type Tension = {
  level: number
  description: string
}

export type Map = {
  title: string
  url: string
}
