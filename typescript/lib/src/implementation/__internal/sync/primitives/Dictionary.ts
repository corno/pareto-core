import * as p_di from "../../../../interface/data"
import * as optional from "./Optional"
import { Abort } from "../../../../interface/__internal/Abort"
import { Raw_Optional_Value } from "../../../../interface/__internal/Raw_Optional_Value"

export type ID_Value_Pair<T> = [string, T]

export type Dictionary_As_Array<T extends p_di.Value> = readonly ID_Value_Pair<T>[]

export class Dictionary_Class<T extends p_di.Value> implements p_di.Dictionary<T> {
    private source: Dictionary_As_Array<T>
    constructor(source: Dictionary_As_Array<T>) {
        this.source = source
    }

    __get_raw(): readonly [string, T][] {
        return this.source
    }

}

