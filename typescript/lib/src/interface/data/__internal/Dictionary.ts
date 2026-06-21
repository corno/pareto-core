import { Abort } from "../../__internal/Abort"
import { Optional_Value } from "./Optional_Value"
import { Value } from "./Value"
import { Raw_Optional_Value } from "../../__internal/Raw_Optional_Value"

/**
 * A dictionary for Pareto.
 * unmutable and minimal by design
 */
export interface Dictionary<T extends Value> {
    __d_map_deprecated<NT extends Value>(
        assign_entry: (value: T, id: string) => NT,
    ): Dictionary<NT>

    __get_possible_entry_deprecated(
        id: string
    ): Optional_Value<T>

    __get_entry_deprecated(
        id: string,
        abort: {
            no_such_entry: Abort<null>,
        }
    ): T

    __get_entry_raw_deprecated(
        id: string
    ): Raw_Optional_Value<T>

    __get_raw(): readonly [string, T][]
}
