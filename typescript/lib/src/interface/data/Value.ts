import { List } from "./List"
import { Dictionary } from "./Dictionary"
import { Optional_Value } from "./Optional_Value"
import { Circular_Dependency } from "./Circular_Dependency"

export type Value =
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