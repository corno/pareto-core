import { type List } from "./List"
import { type Dictionary } from "./Dictionary"
import { type Optional_Value } from "./Optional_Value"
import { type Circular_Dependency } from "./Circular_Dependency"

export type Value =
    | symbol
    | boolean
    | null
    | string
    | number
    | State
    | List<Value>
    | Dictionary<Value>
    | Optional_Value<Value>
    | Circular_Dependency<Value>
    | Group
    
export type State = readonly [string, Value]
export type Group = { [key: string]: Value }