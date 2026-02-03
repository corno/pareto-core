import * as _pi from "./interface"



export type Text_Builder = {
    add_snippet: ($: string) => void
    add_character: ($: number) => void
}

export default function text_build_deprecated (
    $c: ($c: Text_Builder) => void
) {
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