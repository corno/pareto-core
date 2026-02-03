import * as _pi from "../../../../interface"
import * as optional from "./Optional"

import { Raw_Optional_Value } from "../../../../interface/Raw_Optional_Value"
import { List_Class } from "./List"


export type ID_Value_Pair<T> = {
    readonly 'id': string
    readonly 'value': T
}

export type Dictionary_As_Array<T> = readonly ID_Value_Pair<T>[]

export class Dictionary_Class<T> implements _pi.Dictionary<T> {
    private source: Dictionary_As_Array<T>
    constructor(source: Dictionary_As_Array<T>) {
        this.source = source
    }
    public __d_map<NT>(
        $v: (entry: T, id: string) => NT
    ) {
        return new Dictionary_Class<NT>(this.source.map(($) => {
            return {
                id: $.id,
                value: $v($.value, $.id)
            }
        }))
    }
    __to_list<New_Type>(
        handle_value: (value: T, id: string) => New_Type
    ): _pi.List<New_Type> {
        return new List_Class(this.source.map(($) => {
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

