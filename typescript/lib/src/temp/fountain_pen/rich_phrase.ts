
import * as p_ from '../../interface/schema.js'


namespace Phrase_ {
    
    export namespace value {
        
        export type text = string
        
    }
    
    export type value = 
        | readonly ['text', value.text]
    
    
    export namespace composed {
        
        export type L = Phrase_
        
    }
    
    export type composed = p_.List<composed.L>
    
    export namespace optional {
        
        export type O = Phrase_
        
    }
    
    export type optional = p_.Optional_Value<optional.O>
    
    export type nothing = null
    
    export namespace rich_phrase {
        
        export namespace items {
            
            export type L = Phrase_
            
        }
        
        export type items = p_.List<items.L>
        
        export type if_empty = Phrase_
        
        export namespace if_not_empty {
            
            export type before = Phrase_
            
            export type separator = Phrase_
            
            export type after = Phrase_
            
        }
        
        export type if_not_empty = {
            readonly 'before': if_not_empty.before
            readonly 'separator': if_not_empty.separator
            readonly 'after': if_not_empty.after
        }
        
    }
    
    export type rich_phrase = {
        readonly 'items': rich_phrase.items
        readonly 'if empty': rich_phrase.if_empty
        readonly 'if not empty': rich_phrase.if_not_empty
    }
    
}

type Phrase_ = 
    | readonly ['value', Phrase_.value]
    | readonly ['composed', Phrase_.composed]
    | readonly ['optional', Phrase_.optional]
    | readonly ['nothing', Phrase_.nothing]
    | readonly ['rich phrase', Phrase_.rich_phrase]

export type { 
    Phrase_ as Phrase, 
}
