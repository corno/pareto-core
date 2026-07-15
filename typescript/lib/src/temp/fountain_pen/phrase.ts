
import * as p_ from '../../interface/schema.js'

export type Phrase = 
    string
    | readonly ['value', string]
    | readonly ['composed', p_.List<Phrase>]
    | readonly ['nothing', null]
