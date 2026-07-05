
import { type Value } from "./Value.js"

/**
 * A dictionary for Pareto.
 * unmutable and minimal by design
 */
export interface Dictionary<T extends Value> {

    __dictionary: true
    
    __get_raw(): readonly [string, T][]

}
