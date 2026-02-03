
import { $$ as dictionary_literal } from "./expression/literals/Dictionary"
import { $$ as list_literal } from "./expression/literals/List"
import * as initialize from "./expression/assign"

export namespace dictionary {

    export const literal = dictionary_literal

}

export namespace integer {

}

export namespace list {
    
    export const literal = list_literal
    export const nested_literal = initialize.list.nested_literal_old

}

export namespace natural {

}

export namespace optional {
    
    export const set = initialize.optional.set
    export const not_set = initialize.optional.not_set

}

export namespace text {

}