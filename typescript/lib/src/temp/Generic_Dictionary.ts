
import * as p_di from "../interface/data"

export interface Generic_Dictionary<T> {

    __get_raw(): readonly [string, T][]
}


export type ID_Value_Pair<T> = [string, T]

export type Dictionary_As_Array<T> = readonly ID_Value_Pair<T>[]

export class Generic_Dictionary_Class<T> implements Generic_Dictionary<T> {
    private source: Dictionary_As_Array<T>
    constructor(source: Dictionary_As_Array<T>) {
        this.source = source
    }

    __get_raw(): readonly [string, T][] {
        return this.source
    }

}

export const map_value_dictionary_to_generic_dictionary = <T extends p_di.Value, NT>(
    source: p_di.Dictionary<T>,
    $v: (entry: T, id: string) => NT
): Generic_Dictionary<NT> => {
    return new Generic_Dictionary_Class<NT>(source.__get_raw().map(($) => {
        return [
            $[0],
            $v($[1], $[0])
        ]
    }))
}