import { Abort } from "../../__internal/Abort"
import { Optional_Value } from "./Optional_Value"
import { Value } from "./Value"

/**
 * A List for Pareto.
 * unmutable and minimal by design
 */
export interface List<
    T extends Value
> {

    __deprecated_get_possible_item_at(index: number): Optional_Value<T>

    __deprecated_get_item_at(
        index: number,
        abort: {
            out_of_bounds: Abort<null>
        }
    ): T

    __get_raw(): readonly T[]

}