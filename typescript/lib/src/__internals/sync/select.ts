import * as _pi from "../../interface"
import * as _p from "./assign/literals/Optional"

export const entry = <T>(
    dictionary: _pi.Dictionary<T>,
    id: string,
    abort: {
        no_such_entry: _pi.Abort<null>
    }
): T => {
    const entry = dictionary.__get_entry_raw(id)
    return entry === null
        ? abort.no_such_entry(null)
        : entry[0]
}

export const possible_entry = <T>(
    dictionary: _pi.Dictionary<T>,
    id: string,
): _pi.Optional_Value<T> => {
    const entry = dictionary.__get_entry_raw(id)
    return entry === null
        ? new _p.Not_Set_Optional_Value<T>()
        : new _p.Set_Optional_Value<T>(entry[0])
}

