import { List } from "./data/List"
import { Dictionary } from "./data/Dictionary"
import { Optional_Value } from "./data/Optional_Value"
import { Circular_Dependency } from "./data/Circular_Dependency"

export type Parameters = null | { [key: string]: Value }

export type Value =
    | boolean
    | null
    | string
    | number
    | readonly [string, Value]
    | List<Value>
    | Dictionary<Value>
    | Optional_Value<Value>
    | Circular_Dependency<any> // 'any' should be Value, but this causes a circular dependency, so we have to break it here.
    | { [key: string]: Value }
    