import * as p_ from '../../../../implementation/transformer.js'
import p_text_from_list from '../../../../implementation/transformer/specials/text_from_list.js'
import p_list_from_text from '../../../../implementation/refiner/specials/list_from_text.js'

import type * as s_in from "../../private_schemas/semi_lines.js"
import type * as s_out from "../../private_schemas/lines.js"

namespace s_parameters {
    export type Parameters = { 'indentation text': string }
}

namespace declarations {
    export type Lines = p_.Transformer_With_Parameter<
        s_in.Lines,
        s_out.Lines,
        s_parameters.Parameters
    >
}

export const Lines: declarations.Lines = ($, $p) => {
    const indent_characters = p_list_from_text(
        $p['indentation text'],
        ($) => $,
    )
    return p_.from.list($).map(
        ($) => p_text_from_list(
            p_.literal.segmented_list(
                [
                    p_.from.list(p_.from.number($.indentation).repeat(
                        indent_characters,
                    ),
                    ).flatten(
                        ($) => $
                    ),
                    p_list_from_text($.text, ($) => $)

                ],
            ),
            ($) => $,
        )
    )
}