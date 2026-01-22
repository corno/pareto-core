import * as _pi from  "./interface"

import { $$ as list_literal } from "./__internals/sync/expression/literals/list"

export namespace list {

    export const from_text = <T>(
        $: string,
        handle_character: ($: number) => T
    ): _pi.List<T> => {
        const out: T[] = []
        for (let i = 0; i < $.length; i++) {
            out.push(handle_character($.charCodeAt(i)))
        }
        return list_literal(out)
    }

}