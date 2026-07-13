import * as p_ from "../../../implementation/serializer.js"
import type * as p_di from '../../../interface/schema.js'
import p_list_from_text from '../../../implementation/refiner/specials/list_from_text.js'

//schemas
import type * as s_in from "../private_schemas/semi_lines.js"
import type * as s_parameters from "../private_schemas/semi_lines_serialize.js"

namespace declarations {
    export type Lines = p_.Serializer_With_Parameter<
        s_in.Lines,
        s_parameters.Parameters
    >
}

//dependencies
import * as t_fountain_pen_semi_lines_to_lines from "../transformers/semi_lines/_lines.js"

export const Lines = ($: s_in.Lines, $p: s_parameters.Parameters): p_di.List<number> => {
    const amount = p_.from.list($).amount_of_items()
    let current = -1
    return p_.from.list(t_fountain_pen_semi_lines_to_lines.Lines(
        $,
        {
            'indentation text': $p.indentation,
        }
    ),
    ).flatten(
        ($) => {
            current++
            return p_list_from_text<number>(
                current === amount - 1 && !$p['trailing newline']
                    ? $
                    : $ + $p.newline,
                ($) => $
            )
        }
    )
}