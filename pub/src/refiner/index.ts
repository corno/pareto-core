import * as _pi from "../interface"

export * from "../__internals/sync/expression/decide"

export {
    deprecated_cc,
    deprecated_block,
    panic as fixme_abort,
    iterate,
    unreachable_code_path
} from "../__internals/sync/expression/special"

export * from "../__internals/sync/expression/initialize"





type Dictionary_Builder<T> = {
    'add entry': (key: string, value: T) => void
}

import { $$ as _p_dictionary_literal } from "../__internals/sync/expression/literals/dictionary"
export const deprecated_build_dictionary = <T>(
    $: ($c: Dictionary_Builder<T>) => void,
    abort?: _pi.Abort<['duplicate key in dictionary literal', null]>,
): _pi.Dictionary<T> => {
    const temp: { [key: string]: T } = {}
    $({
        'add entry': (key, $) => {
            if (key in temp) {
                if (abort !== undefined) {
                    return abort(['duplicate key in dictionary literal', null])
                } else {
                    throw new Error(`duplicate key in dictionary literal: ${key}`)
                }
            }
            temp[key] = $
        }
    })
    return _p_dictionary_literal(temp)
}

