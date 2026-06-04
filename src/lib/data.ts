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

export interface State {
  lastUpdated: string
  dimensions: Dimensions
}

export function getState(): State {
  return stateData as State
}
