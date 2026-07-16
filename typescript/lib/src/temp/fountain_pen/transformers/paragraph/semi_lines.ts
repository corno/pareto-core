// import * as p_ from '../../../../implementation/transformer.js'
// import type * as p_i from '../../../../interface/transformer.js'
// import type * as p_di from '../../../../interface/schema.js'
// import p_list_build_deprecated from '../../../../implementation/refiner/specials/list_build_deprecated.js'
// import p_text_from_list from '../../../../implementation/transformer/specials/text_from_list.js'
// import p_variables from '../../../../implementation/transformer/specials/variables.js'

// //schemas
// import type * as s_in from "../../paragraph.js"

// import type * as s_out from "../../private_schemas/semi_lines.js"
// namespace declarations {

//     export type Paragraph = p_i.Transformer_With_Parameter<
//         s_in.Paragraph,
//         s_out.Lines,
//         {
//             'indentation level': number
//         }
//     >

//     export type Sentence = p_i.Transformer_With_Parameter<
//         s_in.Sentence,
//         s_out.Lines,
//         {
//             'indentation level': number
//         }
//     >

// }

// export const Paragraph: declarations.Paragraph = ($, $p) => p_.from.state($).decide(
//     ($) => {
//         switch ($[0]) {
//             case 'composed': return p_.option($, ($) => p_.from.list($).flatten(
//                 ($) => Paragraph($, $p)
//             ))
//             case 'sentences': return p_.option($, ($) => p_.from.list($).flatten(
//                 ($) => Sentence($, $p)
//             ))
//             case 'optional': return p_.option($, ($) => p_.from.optional($).decide(
//                 ($) => Paragraph($, $p),
//                 () => p_.literal.list([]),
//             ))
//             case 'nothing': return p_.option($, ($) => p_.literal.list([]))
//             case 'rich list': return p_.option($, ($) => {
//                 const $v_rich_list = $
//                 return p_.from.list($.items).on_has_items(
//                     ($) => p_.literal.segmented_list([
//                         p_.from.optional($v_rich_list['if not empty'].before).decide(
//                             ($) => Sentence($, $p),
//                             () => p_.literal.list([]),
//                         ),
//                         p_variables(
//                             () => {
//                                 const $v_if_not_empty = $v_rich_list['if not empty']
//                                 const $v_amount = p_.from.list($).amount_of_items()
//                                 let current = -1
//                                 return p_.from.list($).flatten(
//                                     ($) => p_variables(
//                                         () => {
//                                             const sentence = $
//                                             current++
//                                             return Sentence(
//                                                 p_.from.optional($v_if_not_empty.separator).decide(
//                                                     ($) => current < $v_amount - 1
//                                                         ? p_.literal.segmented_list([
//                                                             sentence,
//                                                             p_.literal.list([
//                                                                 $
//                                                             ])
//                                                         ])
//                                                         : sentence,
//                                                     () => $
//                                                 ),
//                                                 {
//                                                     'indentation level': $p['indentation level'] + ($v_if_not_empty.indent ? 1 : 0),
//                                                 }
//                                             )
//                                         })
//                                 )
//                             }),
//                         p_.from.optional($v_rich_list['if not empty'].after).decide(
//                             ($) => Sentence($, $p),
//                             () => p_.literal.list([]),
//                         ),
//                     ]),
//                     () => p_.from.optional($['if empty']).decide(
//                         ($) => Sentence($, $p),
//                         () => p_.literal.list([]),
//                     ),
//                 )
//             })
//             default: return p_.exhaustive($[0])
//         }
//     }
// )

// type Summary = p_di.List<Action>


// type Action =
//     | ['append', string]
//     | ['add paragraph', s_out.Lines]

// const Phrase = (
//     $: s_in.Phrase,
//     $p: {
//         'indentation level': number,

//     },
// ): Summary => {
//     if (typeof $ === 'string') {
//         return p_.literal.list<Action>([
//             ['append', $]
//         ])
//     }
//     return p_.from.state($).decide(
//         ($): Summary => {
//             switch ($[0]) {
//                 case 'value': return p_.option($, ($) => {
//                     return p_.literal.list<Action>([
//                         ['append', p_.from.state($).decide(
//                             ($): string => {
//                                 switch ($[0]) {
//                                     case 'text': return p_.option($, ($) => $)
//                                     default: return p_.exhaustive($[0])
//                                 }
//                             })],

//                     ])
//                 })
//                 case 'indent': return p_.option($, ($) => {
//                     const paragraph = Paragraph(
//                         $,
//                         {
//                             'indentation level': $p['indentation level'] + 1,
//                         }
//                     )
//                     if (p_.from.list(paragraph).amount_of_items() !== 0) {
//                         return p_.literal.list<Action>([
//                             ['add paragraph', paragraph]
//                         ])
//                     } else {
//                         return p_.literal.list<Action>([])
//                     }
//                 })
//                 case 'rich paragraph': return p_.option($, ($) => {
//                     const $v_rich_list = $
//                     return p_.from.list($.items).on_has_items(
//                         ($) => {
//                             const sep = $v_rich_list['if not empty'].separator
//                             const amount = p_.from.list($).amount_of_items()
//                             if (amount === 0) {
//                                 return p_.literal.list<Action>([])
//                             }
//                             let current = -1
//                             return p_.literal.segmented_list([
//                                 Phrase(
//                                     $v_rich_list['if not empty'].before,
//                                     $p
//                                 ),
//                                 p_.from.list($).flatten(
//                                     ($): Summary => {
//                                         current++
//                                         const sentence_input = current < amount - 1
//                                             ? p_.literal.segmented_list([$, p_.literal.list([sep])])
//                                             : $
//                                         const lines = Sentence(sentence_input, { 'indentation level': $p['indentation level'] + 1 })
//                                         return p_.from.list(lines).amount_of_items() !== 0
//                                             ? p_.literal.list<Action>([['add paragraph', lines]])
//                                             : p_.literal.list<Action>([])
//                                     }
//                                 ),
//                                 Phrase(
//                                     $v_rich_list['if not empty'].after,
//                                     $p
//                                 )

//                             ])
//                         },
//                         () => Phrase($['if empty'], $p)
//                     )
//                 })
//                 case 'rich phrase': return p_.option($, ($) => {
//                     const $v_rich_list = $
//                     return p_.from.list($.items).on_has_items(
//                         ($) => {
//                             const sep = $v_rich_list['if not empty'].separator
//                             const amount = p_.from.list($).amount_of_items()
//                             let current = -1
//                             return p_.literal.segmented_list([
//                                 Phrase($v_rich_list['if not empty'].before, $p),
//                                 p_.from.list($).flatten(
//                                     ($): Summary => {
//                                         current++
//                                         return current < amount - 1
//                                             ? p_.literal.segmented_list([
//                                                 Phrase($, $p),
//                                                 Phrase(sep, $p)
//                                             ])
//                                             : Phrase($, $p)
//                                     }
//                                 ),
//                                 Phrase($v_rich_list['if not empty'].after, $p)

//                             ])
//                         },
//                         () => Phrase($['if empty'], $p)
//                     )
//                 })
//                 case 'composed': return p_.option($, ($) => p_.from.list($).flatten(
//                     ($) => Phrase($, $p)
//                 ))
//                 case 'optional': return p_.option($, ($) => p_.from.optional($).decide(
//                     ($) => Phrase($, $p),
//                     () => p_.literal.list<Action>([]),
//                 ))
//                 case 'nothing': return p_.option($, ($) => p_.literal.list<Action>([]))
//                 default: return p_.exhaustive($[0])
//             }
//         })
// }

// export const Sentence: declarations.Sentence = ($, $p) => p_list_build_deprecated(
//     ($i) => {
//         let current_line: null | string = null
//         let found_indentation = false
//         p_.from.list($).map(
//             ($) => p_.from.list(Phrase(
//                 $,
//                 {
//                     'indentation level': $p['indentation level'],
//                 }
//             )
//             ).map(
//                 ($) => p_.from.state($).decide(
//                     ($): null => {
//                         switch ($[0]) {
//                             case 'append': return p_.option($, ($) => {
//                                 if (current_line === null) {
//                                     current_line = ""
//                                 }
//                                 current_line += $
//                                 return null
//                             })
//                             case 'add paragraph': return p_.option($, ($) => {
//                                 found_indentation = true
//                                 if (current_line !== null) {
//                                     $i['add item']({
//                                         'indentation': $p['indentation level'],
//                                         'text': current_line,
//                                     })
//                                     current_line = null
//                                 }
//                                 $i['add list']($)
//                                 return null
//                             })
//                             default: return p_.exhaustive($[0])
//                         }
//                     })
//             )
//         )
//         //this is a sentence, always add the current line if no indentation was found, even if it's null, to create an empty line
//         if (current_line === null) {
//             if (!found_indentation) {
//                 $i['add item']({
//                     'indentation': $p['indentation level'],
//                     'text': "",
//                 })
//             }
//         } else {
//             $i['add item']({
//                 'indentation': $p['indentation level'],
//                 'text': current_line,
//             })
//         }
//     }
// )