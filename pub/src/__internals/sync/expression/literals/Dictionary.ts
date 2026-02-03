import * as _pi from "../../../../interface"
import * as optional from "./Optional"

import { $$ as list_literal } from "./List"
import { Raw_Optional_Value } from "../../../../interface/Raw_Optional_Value"


type ID_Value_Pair<T> = {
    readonly 'id': string
    readonly 'value': T
}

function create_dictionary_as_array<X>(source: { readonly [id: string]: X }): Dictionary_As_Array<X> {
    const imp: ID_Value_Pair<X>[] = []
    Object.keys(source).forEach((id) => {
        imp.push({ id: id, value: source[id] })
    })
    return imp
}

type Dictionary_As_Array<T> = readonly ID_Value_Pair<T>[]

class Dictionary<T> implements _pi.Dictionary<T> {
    private source: Dictionary_As_Array<T>
    constructor(source: Dictionary_As_Array<T>) {
        this.source = source
    }
    public __d_map<NT>(
        $v: (entry: T, id: string) => NT
    ) {
        return new Dictionary<NT>(this.source.map(($) => {
            return {
                id: $.id,
                value: $v($.value, $.id)
            }
        }))
    }
    __to_list<New_Type>(
        handle_value: (value: T, id: string) => New_Type
    ): _pi.List<New_Type> {
        return list_literal(this.source.map(($) => {
            return handle_value($.value, $.id)
        }))
    }

    __get_possible_entry(
        id: string,
    ): _pi.Optional_Value<T> {
        for (let i = 0; i !== this.source.length; i += 1) {
            const entry = this.source[i]
            if (entry.id === id) {
                return new optional.Set_Optional_Value(entry.value)
            }
        }
        return new optional.Not_Set_Optional_Value()
    }

    __get_entry_raw(
        id: string,
    ): Raw_Optional_Value<T> {
        for (let i = 0; i !== this.source.length; i += 1) {
            const entry = this.source[i]
            if (entry.id === id) {
                return [entry.value]
            }
        }
        return null
    }

    __get_entry(
        id: string,
        abort: _pi.Abort<null>,
    ): T {
        for (let i = 0; i !== this.source.length; i += 1) {
            const entry = this.source[i]
            if (entry.id === id) {
                return entry.value
            }
        }
        return abort(null)
    }

    __get_number_of_entries(): number {
        return this.source.length
    }

}



/**
 * creates a Pareto dictionary
 */
export function $$<T>(source: { readonly [id: string]: T }): _pi.Dictionary<T> {

    return new Dictionary(create_dictionary_as_array(source))
}