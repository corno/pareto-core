import * as p_di from "../../data/interface"
import * as xxxx from "./assign/literals/Optional"
import * as p_i from "../../interface"

export const entry = <T extends p_di.Value>(
    dictionary: p_di.Dictionary<T>,
    id: string,
    abort: {
        no_such_entry: p_i.Abort<null>
    }
): T => {
    const entry = dictionary.__get_entry_raw(id)
    return entry === null
        ? abort.no_such_entry(null)
        : entry[0]
}

export const possible_entry = <T extends p_di.Value>(
    dictionary: p_di.Dictionary<T>,
    id: string,
): p_di.Optional_Value<T> => {
    const entry = dictionary.__get_entry_raw(id)
    return entry === null
        ? new xxxx.Not_Set_Optional_Value<T>()
        : new xxxx.Set_Optional_Value<T>(entry[0])
}

