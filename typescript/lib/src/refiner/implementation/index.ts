export * as literal from "../../__internals/sync/literal"
export * as decide from "../../__internals/sync/decide"

export * from "../../__internals/sync/data_switch"



import * as p_di from "../../data/interface"
import { Abort } from "../../__internals/Abort"
export namespace select {


    export const entry = <T extends p_di.Value>(
        dictionary: p_di.Dictionary<T>,
        id: string,
        abort: {
            no_such_entry: Abort<null>
        }
    ): T => {
        const entry = dictionary.__get_entry_raw(id)
        return entry === null
            ? abort.no_such_entry(null)
            : entry[0]
    }

}