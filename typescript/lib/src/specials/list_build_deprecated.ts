import { List_Class } from "../__internals/sync/assign/literals/List"
import * as _pi from "../interface"

type List_Builder<T extends _pi.Value> = {
    'add item': ($: T) => void
    'add list': ($: _pi.List<T>) => void
}

export default function _p_list_build_deprecated<T extends _pi.Value>(
    callback: (
        $i: List_Builder<T>
    ) => void
): _pi.List<T> {
    const temp: T[] = []
    callback({
        'add item': ($) => {
            temp.push($)
        },
        'add list': ($) => {
            temp.push(...$.__get_raw_copy())
        }
    })
    return new List_Class(temp)
}