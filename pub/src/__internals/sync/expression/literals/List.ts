import * as _pi from "../../../../interface"
import * as optional from "./Optional"

import { Raw_Optional_Value } from "../../../../interface/Raw_Optional_Value"


export class List_Class<T> implements _pi.List<T> {
    private data: readonly T[]
    constructor(data: readonly T[]) {
        this.data = data
    }
    __l_map<NT>(
        $v: (entry: T) => NT
    ) {
        return new List_Class(this.data.map((entry) => {
            return $v(entry)
        }))
    }

    __get_number_of_items() {
        return this.data.length
    }

    __deprecated_get_possible_item_at(index: number) {
        if (index < 0 || index >= this.data.length) {
            return new optional.Not_Set_Optional_Value<T>()
        }
        return new optional.Set_Optional_Value(this.data[index])
    }

    __deprecated_get_item_at(
        index: number,
        abort: _pi.Abort<null>,
    ) {
        if (index < 0 || index >= this.data.length) {
            return abort(null)
        }
        return this.data[index]
    }

    __get_raw_copy(): readonly T[] {
        return this.data
    }


}

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

    return new List_Class(data)
}
