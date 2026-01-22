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
export function $$<T>(source: { readonly [key: string]: T }): _pi.Dictionary<T> {

    type Key_Value_Pair<T> = {
        readonly 'key': string
        readonly 'value': T
    }

    type Dictionary_As_Array<T> = readonly Key_Value_Pair<T>[]

    /**
     * this is an implementation, not public by design
     */
    class Dictionary<T> implements _pi.Dictionary<T> {
        private source: Dictionary_As_Array<T>
        constructor(source: Dictionary_As_Array<T>) {
            this.source = source
        }
        public __d_map<NT>(
            $v: (entry: T, key: string) => NT
        ) {
            return new Dictionary<NT>(this.source.map(($) => {
                return {
                    key: $.key,
                    value: $v($.value, $.key)
                }
            }))
        }
        __to_list<New_Type>(
            handle_value: (value: T, key: string) => New_Type
        ): _pi.List<New_Type> {
            return list_literal(this.source.map(($) => {
                return handle_value($.value, $.key)
            }))
        }

        __get_possible_entry(
            key: string,
        ): _pi.Optional_Value<T> {
            for (let i = 0; i !== this.source.length; i += 1) {
                const element = this.source[i]
                if (element.key === key) {
                    return optional.set(element.value)
                }
            }
            return optional.not_set()
        }

        __get_entry_raw(
            key: string,
        ): Raw_Optional_Value<T> {
            for (let i = 0; i !== this.source.length; i += 1) {
                const element = this.source[i]
                if (element.key === key) {
                    return [element.value]
                }
            }
            return null
        }

        __get_entry(
            key: string,
            abort: _pi.Abort<null>,
        ): T {
            for (let i = 0; i !== this.source.length; i += 1) {
                const element = this.source[i]
                if (element.key === key) {
                    return element.value
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

    function create_dictionary_as_array<X>(source: { readonly [key: string]: X }): Dictionary_As_Array<X> {
        const imp: Key_Value_Pair<X>[] = []
        Object.keys(source).forEach((key) => {
            imp.push({ key: key, value: source[key] })
        })
        return imp
    }
    const daa = create_dictionary_as_array(source)
    return new Dictionary(daa)
}