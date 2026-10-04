import { List_Class } from "../../__internal/sync/primitives/List.js"
import * as p_di from "../../schema.js"

type List_Builder<T extends p_di.Value> = {
    'add item': ($: T) => undefined
    'add list': ($: p_di.List<T>) => undefined
}

export default function <T extends p_di.Value>(
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
            $.__get_raw().forEach(($) => { temp.push($) })
        }
    })
    return new List_Class(temp)
}