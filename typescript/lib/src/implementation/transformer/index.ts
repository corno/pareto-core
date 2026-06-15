export * from "../__internal/sync/data_switch"

export * as decide from "../__internal/sync/decide"

export * as boolean from "../__internal/sync/transform/boolean"
export * as dictionary from "../__internal/sync/transform/dictionary"
export * as group from "../__internal/sync/transform/group"
export * as list from "../__internal/sync/transform/list"
export * as number from "../__internal/sync/transform/number"
export * as optional from "../__internal/sync/transform/optional"
export * as state from "../__internal/sync/transform/state"

export * as literal from "../__internal/sync/literal"



import * as p_di from "../../interface/data"
import * as xxxx from "../__internal/sync/assign/literals/Optional"

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
