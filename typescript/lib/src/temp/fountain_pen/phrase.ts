

export type Phrase = 
    string
    | readonly ['value', string]
    | readonly ['composed', readonly Phrase[]]
    | readonly ['nothing', null]
