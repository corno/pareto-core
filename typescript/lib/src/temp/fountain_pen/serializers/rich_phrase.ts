import * as p_ from '../../../implementation/serializer.js'

//schemas
import type * as s_in from "../rich_phrase.js"

//dependencies
import * as t_to_list_of_strings from "../transformers/rich_phrase/list_of_strings.js"



export const Phrase = ($: s_in.Phrase): string => p_.text_from_phrase(['composed', t_to_list_of_strings.Phrase(
    $
).__get_raw()])