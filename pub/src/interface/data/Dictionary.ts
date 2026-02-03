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
        handle_entry: (value: T, id: string) => NT,
    ): Dictionary<NT>


    /**
     * the ordering of the list will be the same as the insertion order in the dictionary
     */
    __to_list<New_Type>(
        handle_entry: (value: T, id: string) => New_Type
    ): List<New_Type>

    /**
     * This method is only to be used by resources
     * returns an {@link Optional_Value } of type T reflecting wether the entry existed or not
     * 
     * @param id 
     */
    __get_possible_entry(
        id: string
    ): Optional_Value<T>

    __get_entry(
        id: string,
        abort: Abort<null>
    ): T

    __get_entry_raw(
        id: string
    ): Raw_Optional_Value<T>

    __get_number_of_entries(): number
}
