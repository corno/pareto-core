import { List_Class } from "../../__internal/sync/primitives/List"
import * as p_di from "../../../interface/data"

type List_Builder<T extends p_di.Value> = {
    'add item': ($: T) => undefined
    'add list': ($: p_di.List<T>) => undefined
}

export default function list_build_deprecated<T extends p_di.Value>(
    callback: (
        $i: List_Builder<T>
    ) => undefined
): p_di.List<T> {
    const temp: T[] = []
    callback({
        'add item': ($) => {
            temp.push($)
        },
        'add list': ($) => {
            temp.push(...$.__get_raw())
        }
    })
    return new List_Class(temp)
}