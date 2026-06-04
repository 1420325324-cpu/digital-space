import stateData from '../../data/state.json'

export interface FocusArea {
  name: string
  weight: number
}

export interface Dimensions {
  energy: {
    value: number
    delta: number
    label: string
  }
  focus: {
    areas: FocusArea[]
  }
  mood: {
    temperature: number
    label: string
  }
  thinking: {
    intensity: number
    label: string
  }
  balance: {
    work: number
    life: number
  }
}

export interface Identity {
  name: string
  tagline: string
  bio: string
}

export interface Recent {
  topics: string[]
  activity: string
}

export interface Now {
  status: string
  listening: string | null
  reading: string | null
}

export interface State {
  lastUpdated: string
  identity: Identity
  dimensions: Dimensions
  recent: Recent
  now: Now
}

export function getState(): State {
  return stateData as State
}
