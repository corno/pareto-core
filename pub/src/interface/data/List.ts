import { Abort } from "../interfaces"
import { Raw_Optional_Value } from "../Raw_Optional_Value"
import { Optional_Value } from "./Optional_Value"

/**
 * A List for Pareto.
 * unmutable and minimal by design
 */
export interface List<T> {
    /**
     * 
     * @param handle_item callback to transform an individual entry.
     */
    __l_map<NT>(
        handle_item: ($: T) => NT,
    ): List<NT>

    __get_number_of_items(): number

    __deprecated_get_possible_item_at(index: number): Optional_Value<T>
    
    __deprecated_get_item_at(
        index: number,
        abort: Abort<null>
    ): T

    /**
     * This method is only to be used by resources
     * iterates over all entries
     * 
     * @param $handle_value callback to process the entry
     */
    __for_each(
        handle_item: ($: T) => void
    ): void

    __get_raw_copy(): readonly T[]

}