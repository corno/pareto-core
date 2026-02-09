import { Abort } from "../specials"
import { Raw_Optional_Value } from "../Raw_Optional_Value"
import { List } from "./List"
import { Optional_Value } from "./Optional_Value"


/**
 * A dictionary for Pareto.
 * unmutable and minimal by design
 */
export interface Dictionary<T> {
    __d_map<NT>(
        assign_entry: (value: T, id: string) => NT,
    ): Dictionary<NT>

    /**
     * the ordering of the list will be the same as the insertion order in the dictionary
     */
    __to_list<New_Type>(
        assign_item: (value: T, id: string) => New_Type
    ): List<New_Type>

    __get_possible_entry_deprecated(
        id: string
    ): Optional_Value<T>

    __get_entry_deprecated(
        id: string,
        abort: {
            no_such_entry: Abort<null>,
        }
    ): T

    __get_entry_raw(
        id: string
    ): Raw_Optional_Value<T>

    __get_number_of_entries(): number
}
