import * as _pi from "./interface"

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

}

