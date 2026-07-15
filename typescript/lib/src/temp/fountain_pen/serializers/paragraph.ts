import * as p_ from '../../../implementation/serializer.js'
import * as p_schema from '../../../interface/schema.js'

//schemas
import type * as s_in from "../paragraph.js"
import type * as s_parameters from "../serialize_prose.js"

//dependencies
import * as t_fountain_pen_block_to_semi_lines from "../transformers/paragraph/semi_lines.js"
import * as t_semi_lines_to_list_of_characters from "./semi_lines.js"


export const Paragraph = ($: s_in.Paragraph, $p: s_parameters.Parameters): p_schema.List<number> => t_semi_lines_to_list_of_characters.Lines(
    t_fountain_pen_block_to_semi_lines.Paragraph($, { 'indentation level': 0 }),
    {
        'indentation': $p.indentation,
        'newline': $p['newline'],
        'trailing newline': true,
    }
)

export const Phrase = ($: s_in.Phrase, $p: s_parameters.Parameters): p_schema.List<number> => t_semi_lines_to_list_of_characters.Lines(
    t_fountain_pen_block_to_semi_lines.Sentence(
        p_.literal.list([
            $
        ]),
        { 'indentation level': 0 }
    ),
    {
        'indentation': $p.indentation,
        'newline': $p['newline'],
        'trailing newline': false,
    }
)

