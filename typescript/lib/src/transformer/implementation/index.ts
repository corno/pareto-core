export * from "../../__internals/sync/data_switch"

export * as decide from "../../__internals/sync/decide"

export * as boolean from "../../__internals/sync/transform/boolean"
export * as dictionary from "../../__internals/sync/transform/dictionary"
export * as group from "../../__internals/sync/transform/group"
export * as list from "../../__internals/sync/transform/list"
export * as number from "../../__internals/sync/transform/number"
export * as optional from "../../__internals/sync/transform/optional"
export * as state from "../../__internals/sync/transform/state"

export * as literal from "../../__internals/sync/literal"



import * as p_di from "../../data/interface"
import * as xxxx from "../../__internals/sync/assign/literals/Optional"

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
