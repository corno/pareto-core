import * as p_di from "../../../../interface/data.js"

export type ID_Value_Pair<T> = [string, T]

export type Dictionary_As_Array<T extends p_di.Value> = readonly ID_Value_Pair<T>[]

export class Dictionary_Class<T extends p_di.Value> implements p_di.Dictionary<T> {
    private source: Dictionary_As_Array<T>
    constructor(source: Dictionary_As_Array<T>) {
        this.source = source
    }

    readonly __dictionary = true

    __get_raw(): readonly [string, T][] {
        return this.source
    }

}

