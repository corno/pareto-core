export * from "../__internal/sync/data_switch"

export * as from from "../__internal/sync/transformer"

export * as literal from "../__internal/sync/literal"



import * as p_di from "../../interface/data"
import * as xxxx from "../__internal/sync/primitives/Optional"

export namespace select {

    export const possible_entry = <T extends p_di.Value>(
        dictionary: p_di.Dictionary<T>,
        id: string,
    ): p_di.Optional_Value<T> => {
        const entry = dictionary.__get_entry_raw(id)
        return entry === null
            ? new xxxx.Not_Set_Optional_Value<T>()
            : new xxxx.Set_Optional_Value<T>(entry[0])
    }

}
