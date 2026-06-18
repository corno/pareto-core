import { Abort } from "../interface/__internal/Abort"
import { Raw_Optional_Value } from "../interface/__internal/Raw_Optional_Value"
import * as p_di from "../interface/data"

export interface Generic_Dictionary<T> {
    __d_map_deprecated<NT>(
        assign_entry: (value: T, id: string) => NT,
    ): Generic_Dictionary<NT>

    __get_entry_deprecated(
        id: string,
        abort: {
            no_such_entry: Abort<null>,
        }
    ): T

    __get_entry_raw(
        id: string
    ): Raw_Optional_Value<T>

    __get_raw_copy(): readonly [string, T][]
}


export type ID_Value_Pair<T> = [string, T]

export type Dictionary_As_Array<T> = readonly ID_Value_Pair<T>[]

export class Generic_Dictionary_Class<T> implements Generic_Dictionary<T> {
    private source: Dictionary_As_Array<T>
    constructor(source: Dictionary_As_Array<T>) {
        this.source = source
    }
    public __d_map_deprecated<NT>(
        $v: (entry: T, id: string) => NT
    ) {
        return new Generic_Dictionary_Class<NT>(this.source.map(($) => {
            return [
                $[0],
                $v($[1], $[0])
            ]
        }))
    }

    // __get_possible_entry_deprecated(
    //     id: string,
    // ): p_di.Optional_Value<T> {
    //     for (let i = 0; i !== this.source.length; i += 1) {
    //         const entry = this.source[i]
    //         if (entry[0] === id) {
    //             return new optional.Set_Optional_Value(entry[1])
    //         }
    //     }
    //     return new optional.Not_Set_Optional_Value()
    // }

    __get_entry_raw(
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

    __get_raw_copy(): readonly [string, T][] {
        return this.source
    }

}

export const map_value_dictionary_to_generic_dictionary = <T extends p_di.Value, NT>(
    source: p_di.Dictionary<T>,
    $v: (entry: T, id: string) => NT
): Generic_Dictionary<NT> => {
    return new Generic_Dictionary_Class<NT>(source.__get_raw_copy().map(($) => {
        return [
            $[0],
            $v($[1], $[0])
        ]
    }))
}