import * as p_ from '../../../../implementation/transformer.js'
import type * as p_i from '../../../../interface/transformer.js'

//schemas
import type * as s_in from "../../paragraph.js"
import type * as s_out from "../../private_schemas/lines.js"

namespace declarations {

    export type Paragraph = p_i.Transformer_With_Parameter<
        s_in.Paragraph,
        s_out.Lines,
        {
            'indentation': string
        }
    >

    export type Phrase = p_i.Transformer_With_Parameter<
        s_in.Phrase,
        s_out.Lines,
        {
            'indentation': string
        }
    >

}

//dependencies
import * as t_semi_lines_to_lines from "../semi_lines/_lines.js"
import * as t_to_semi_lines from "./semi_lines.js"

//shorthands
// import * as sh from "../../../../shorthands/prose/deprecated.js"

export const Paragraph: declarations.Paragraph = ($, $p) => t_semi_lines_to_lines.Lines(
    t_to_semi_lines.Paragraph(
        $,
        {
            'indentation level': 0
        }
    ),
    {
        'indentation text': $p.indentation
    }
)



// export const Phrase: declarations.Phrase = ($, $p) => t_semi_lines_to_lines.Lines(
//     t_to_semi_lines.Paragraph(
//         ['sentences', p_.literal.list([sh.sentence(
//             p_.literal.list([])
//         )])],
//         { 'indentation level': 0 }
//     ),
//     { 'indentation text': $p.indentation }
// )