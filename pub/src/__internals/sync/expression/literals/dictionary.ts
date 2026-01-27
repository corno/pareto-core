import * as _pi from "../../../../interface"
import * as optional from "./optional"

import { $$ as list_literal } from "./list"
import { Raw_Optional_Value } from "../../../../interface/Raw_Optional_Value"

/**
 * returns a Exupery dictionary
 * 
 * why is this not the constructor? to call a constructor, you have to use the keyword 'new'. Exupery doesn't use the concept of a class so that keyword should be avoided
 * @param source An object literal
 * @returns 
 */
export function $$<T>(source: { readonly [id: string]: T }): _pi.Dictionary<T> {

    type ID_Value_Pair<T> = {
        readonly 'id': string
        readonly 'value': T
    }

    type Dictionary_As_Array<T> = readonly ID_Value_Pair<T>[]

    /**
     * this is an implementation, not public by design
     */
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
                    return optional.set(entry.value)
                }
            }
            return optional.not_set()
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

    //first we clone the source data so that changes to that source will have no impact on this implementation.
    //only works if the set does not become extremely large

    function create_dictionary_as_array<X>(source: { readonly [id: string]: X }): Dictionary_As_Array<X> {
        const imp: ID_Value_Pair<X>[] = []
        Object.keys(source).forEach((id) => {
            imp.push({ id: id, value: source[id] })
        })
        return imp
    }
    const daa = create_dictionary_as_array(source)
    return new Dictionary(daa)
}