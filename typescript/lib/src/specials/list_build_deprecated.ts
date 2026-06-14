import { List_Class } from "../__internals/sync/assign/literals/List"
import * as p_id from "../data/interface"

type List_Builder<T extends p_id.Value> = {
    'add item': ($: T) => void
    'add list': ($: p_id.List<T>) => void
}

export default function list_build_deprecated<T extends p_id.Value>(
    callback: (
        $i: List_Builder<T>
    ) => void
): p_id.List<T> {
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