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
    public __d_map_deprecated<NT extends p_di.Value>(
        $v: (entry: T, id: string) => NT
    ) {
        return new Dictionary_Class<NT>(this.source.map(($) => {
            return [
                $[0],
                $v($[1], $[0])
            ]
        }))
    }

    __get_possible_entry_deprecated(
        id: string,
    ): p_di.Optional_Value<T> {
        for (let i = 0; i !== this.source.length; i += 1) {
            const entry = this.source[i]
            if (entry[0] === id) {
                return new optional.Set_Optional_Value(entry[1])
            }
        }
        return new optional.Not_Set_Optional_Value()
    }

    __get_entry_raw_deprecated(
        id: string,
    ): Raw_Optional_Value<T> {
        for (let i = 0; i !== this.source.length; i += 1) {
            const entry = this.source[i]
            if (entry[0] === id) {
                return [entry[1]]
            }
        }
        return null
    }

    __get_entry_deprecated(
        id: string,
        abort: {
            no_such_entry: Abort<null>,
        }
    ): T {
        for (let i = 0; i !== this.source.length; i += 1) {
            const entry = this.source[i]
            if (entry[0] === id) {
                return entry[1]
            }
        }
        return abort.no_such_entry(null)
    }

    __get_raw(): readonly [string, T][] {
        return this.source
    }

}

