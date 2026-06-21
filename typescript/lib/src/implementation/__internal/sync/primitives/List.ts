import * as p_di from "../../../../interface/data"
import * as optional from "./Optional"
import { Abort } from "../../../../interface/__internal/Abort"

export class List_Class<T extends p_di.Value> implements p_di.List<T> {
    private data: readonly T[]
    constructor(data: readonly T[]) {
        this.data = data
    }
    __l_map_deprecated<NT extends p_di.Value>(
        $v: (entry: T) => NT
    ) {
        return new List_Class(this.data.map((entry) => {
            return $v(entry)
        }))
    }

    __deprecated_get_possible_item_at(index: number) {
        if (index < 0 || index >= this.data.length) {
            return new optional.Not_Set_Optional_Value<T>()
        }
        return new optional.Set_Optional_Value(this.data[index])
    }

    __deprecated_get_item_at(
        index: number,
        abort: {
            out_of_bounds: Abort<null>
        },
    ) {
        if (index < 0 || index >= this.data.length) {
            return abort.out_of_bounds(null)
        }
        return this.data[index]
    }

    __get_raw(): readonly T[] {
        return this.data
    }


}
