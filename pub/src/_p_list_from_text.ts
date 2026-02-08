import * as _pi from "./interface"

import { List_Class } from "./__internals/sync/assign/literals/List"

export default function _p_list_from_text  <T>(
    $: string,
    handle_character: ($: number) => T
): _pi.List<T> {
    const out: T[] = []
    for (let i = 0; i < $.length; i++) {
        out.push(handle_character($.charCodeAt(i)))
    }
    return new List_Class(out)
}