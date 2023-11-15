type Phase = 'ecs' | 'render'

type NumericDictionary = {
  [PHASE in Phase as string]: number
}

type Fidelity = NumericDictionary & {
  overall: number
}

type IndexDictionary = NumericDictionary
type PhaseFidelity   = NumericDictionary

type FloatDictionary = {
  [PHASE in Phase as string]: Float32Array
}

type PhaseDictionary = FloatDictionary
type TimeDictionary  = FloatDictionary
