
import * as p_i from '../../../__internal/Abort.js'
import * as p_di from '../../../schema.js'

export namespace Lines_ {
    
    export namespace L {
        
        export type text = string
        
        export type indentation = number
        
    }
    
    export type L = {
        readonly 'text': L.text
        readonly 'indentation': L.indentation
    }
    
}

export type Lines_ = p_di.List<Lines_.L>

export type { 
    Lines_ as Lines, 
}
