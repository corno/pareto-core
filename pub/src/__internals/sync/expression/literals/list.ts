import * as _pi from  "../../../../interface"
import * as optional from "./optional"

import { Raw_Optional_Value } from "../../../../interface/Raw_Optional_Value"


export function $$<T>(source: readonly T[]): _pi.List<T> {
    if (!(source instanceof Array)) {
        throw new Error("invalid input in 'list_literal'")
    }
    const data = source.slice() //create a copy
    /**
     * this is an implementation, not public by design
     * If you feel the need to rename this class, don't rename it to 'Array',
     * it will break the 'instanceOf Array' test
     */
    class List_Class<T> implements _pi.List<T> {
        private data: readonly T[]
        constructor(data: readonly T[]) {
            this.data = data
        }
        __l_map<NT>(
            $v: (entry: T) => NT
        ) {
            return $$(this.data.map((entry) => {
                return $v(entry)
            }))
        }

        __get_number_of_elements() {
            return this.data.length
        }

        //internal methods
        __for_each($i: ($: T) => void) {
            this.data.forEach(($) => {
                $i($)
            })
        }

        __get_possible_element_at(index: number) {
            if (index < 0 || index >= this.data.length) {
                return optional.not_set<T>()
            }
            return optional.set(this.data[index])
        }

        __get_element_at(
            index: number,
            abort: _pi.Abort<null>,
        ) {
            if (index < 0 || index >= this.data.length) {
                return abort(null)
            }
            return this.data[index]
        }

        __get_element_at_raw(
            index: number,
        ): Raw_Optional_Value<T> {
            if (index < 0 || index >= this.data.length) {
                return null
            }
            return [this.data[index]]
        }

        __get_raw_copy(): readonly T[] {
            return this.data
        }


    }
    return new List_Class(data)
}
