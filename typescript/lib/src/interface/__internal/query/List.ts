import { type Abort } from "../Abort.js"
import { type Optional_Value } from "./Optional_Value.js"
import { type Value } from "../data/Value.js"

/**
 * A List for Pareto.
 * unmutable and minimal by design
 */
export interface List<
    T extends Value
> {

    __list: true

    __deprecated_get_possible_item_at(index: number): Optional_Value<T>

    __deprecated_get_item_at(
        index: number,
        abort: {
            out_of_bounds: Abort<null>
        }
    ): T

    __get_raw(): readonly T[]

}