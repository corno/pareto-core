
import * as p_ from '../../interface/schema.js'

namespace Paragraph_ {
    
    export namespace composed {
        
        export type L = Paragraph_
        
    }
    
    export type composed = p_.List<composed.L>
    
    export namespace sentences {
        
        export type L = Sentence_
        
    }
    
    export type sentences = p_.List<sentences.L>
    
    export namespace optional {
        
        export type O = Paragraph_
        
    }
    
    export type optional = p_.Optional_Value<optional.O>
    
    export type nothing = null
    
    export namespace rich_list {
        
        export namespace items {
            
            export type L = Sentence_
            
        }
        
        export type items = p_.List<items.L>
        
        export namespace if_empty {
            
            export type O = Sentence_
            
        }
        
        export type if_empty = p_.Optional_Value<if_empty.O>
        
        export namespace if_not_empty {
            
            export namespace before {
                
                export type O = Sentence_
                
            }
            
            export type before = p_.Optional_Value<before.O>
            
            export type indent = boolean
            
            export namespace separator {
                
                export type O = Phrase_
                
            }
            
            export type separator = p_.Optional_Value<separator.O>
            
            export namespace after {
                
                export type O = Sentence_
                
            }
            
            export type after = p_.Optional_Value<after.O>
            
        }
        
        export type if_not_empty = {
            readonly 'before': if_not_empty.before
            readonly 'indent': if_not_empty.indent
            readonly 'separator': if_not_empty.separator
            readonly 'after': if_not_empty.after
        }
        
    }
    
    export type rich_list = {
        readonly 'items': rich_list.items
        readonly 'if empty': rich_list.if_empty
        readonly 'if not empty': rich_list.if_not_empty
    }
    
}

type Paragraph_ = 
    | readonly ['composed', Paragraph_.composed]
    | readonly ['sentences', Paragraph_.sentences]
    | readonly ['optional', Paragraph_.optional]
    | readonly ['nothing', Paragraph_.nothing]
    | readonly ['rich list', Paragraph_.rich_list]

namespace Sentence_ {
    
    export type L = Phrase_
    
}

type Sentence_ = p_.List<Sentence_.L>

namespace Phrase_ {
    
    export namespace value {
        
        export type text = string
        
    }
    
    export type value = 
        | readonly ['text', value.text]
    
    export type indent = Paragraph_
    
    export namespace composed {
        
        export type L = Phrase_
        
    }
    
    export type composed = p_.List<composed.L>
    
    export namespace optional {
        
        export type O = Phrase_
        
    }
    
    export type optional = p_.Optional_Value<optional.O>
    
    export type nothing = null
    
    export namespace rich_paragraph {
        
        export namespace items {
            
            export type L = Sentence_
            
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
    
    export type rich_paragraph = {
        readonly 'items': rich_paragraph.items
        readonly 'if empty': rich_paragraph.if_empty
        readonly 'if not empty': rich_paragraph.if_not_empty
    }
    
    export type rich_phrase = {
        readonly 'items': rich_phrase.items
        readonly 'if empty': rich_phrase.if_empty
        readonly 'if not empty': rich_phrase.if_not_empty
    }
    
}

type Phrase_ = 
    | readonly ['value', Phrase_.value]
    | readonly ['indent', Phrase_.indent]
    | readonly ['composed', Phrase_.composed]
    | readonly ['optional', Phrase_.optional]
    | readonly ['nothing', Phrase_.nothing]
    | readonly ['rich paragraph', Phrase_.rich_paragraph]
    | readonly ['rich phrase', Phrase_.rich_phrase]

export type { 
    Paragraph_ as Paragraph, 
    Sentence_ as Sentence, 
    Phrase_ as Phrase, 
}
