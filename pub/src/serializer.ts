import * as _pi from "./interface"

import { $$ as deprecated_get_location_info } from "./__internals/sync/get_location_info"

export namespace text {

    export const deprecated_build = (
        $c: ($c: _pi.Text_Builder) => void
    ) => {
        let out = ""
        $c({
            add_snippet: ($) => {
                out += $
            },
            add_character: ($) => {
                out += String.fromCodePoint($)
            }
        })
        return out
    }


    export const from_list = <T>(
        list: _pi.List<T>,
        get_character: (item: T) => number,
    ) => {
        let out = ""
        const chunkSize = 100000;
        const array_of_numbers = list.__l_map(($) => get_character($)).__get_raw_copy()
        for (let i = 0; i < array_of_numbers.length; i += chunkSize) {
            const chunk = array_of_numbers.slice(i, i + chunkSize);
            out += String.fromCharCode(...chunk);
        }
        return out
    }

    export const source_file = (depth: number): string => {
        return deprecated_get_location_info(depth).file
    }

}

