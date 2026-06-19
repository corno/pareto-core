export * as literal from "../__internal/sync/literal"

export * from "../__internal/sync/data_switch"
export * as from from "./__internal/from"


import * as p_di from "../../interface/data"
import { Abort } from "../../interface/__internal/Abort"

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