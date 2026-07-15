import * as p_ from '../../../../implementation/transformer.js'
import type * as p_di from '../../../../interface/schema.js'
//schemas
import type * as s_in from "../../rich_phrase.js"

export const Phrase = (
    $: s_in.Phrase
): p_di.List<string> => {
    if (typeof $ === 'string') {
        return p_.literal.list<string>([
            $
        ])
    }
    return p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'value': return p_.option($, ($) => {
                    return p_.literal.list<string>([
                         p_.from.state($).decide(
                            ($): string => {
                                switch ($[0]) {
                                    case 'text': return p_.option($, ($) => $)
                                    default: return p_.exhaustive($[0])
                                }
                            }),

                    ])
                })
                case 'rich phrase': return p_.option($, ($) => {
                    const $v_rich_list = $
                    return p_.from.list($.items).on_has_items(
                        ($) => {
                            const sep = $v_rich_list['if not empty'].separator
                            const amount = p_.from.list($).amount_of_items()
                            let current = -1
                            return p_.literal.segmented_list([
                                Phrase($v_rich_list['if not empty'].before),
                                p_.from.list($).flatten(
                                    ($) => {
                                        current++
                                        return current < amount - 1
                                            ? p_.literal.segmented_list([
                                                Phrase($),
                                                Phrase(sep)
                                            ])
                                            : Phrase($)
                                    }
                                ),
                                Phrase($v_rich_list['if not empty'].after)

                            ])
                        },
                        () => Phrase($['if empty'])
                    )
                })
                case 'composed': return p_.option($, ($) => p_.from.list($).flatten(
                    ($) => Phrase($)
                ))
                case 'optional': return p_.option($, ($) => p_.from.optional($).decide(
                    ($) => Phrase($),
                    () => p_.literal.list<string>([]),
                ))
                case 'nothing': return p_.option($, ($) => p_.literal.list<string>([]))
                default: return p_.exhaustive($[0])
            }
        })
}
