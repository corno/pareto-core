import { List_Class } from "../__internal/sync/assign/literals/List"
import * as p_di from "../../interface/data"

type List_Builder<T extends p_di.Value> = {
    'add item': ($: T) => void
    'add list': ($: p_di.List<T>) => void
}

export default function list_build_deprecated<T extends p_di.Value>(
    callback: (
        $i: List_Builder<T>
    ) => void
): p_di.List<T> {
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