import { Abort } from "../../__internal/Abort"
import { Optional_Value } from "./Optional_Value"
import { Value } from "./Value"
import { Raw_Optional_Value } from "../../__internal/Raw_Optional_Value"

/**
 * A dictionary for Pareto.
 * unmutable and minimal by design
 */
export interface Dictionary<T extends Value> {

    __get_raw(): readonly [string, T][]
    
}
