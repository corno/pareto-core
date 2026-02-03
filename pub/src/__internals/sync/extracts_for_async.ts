
import * as initialize from "./expression/assign"

export namespace dictionary {

    export const literal = initialize.dictionary.literal
}

export namespace integer {

}

export namespace list {
    
    export const literal = initialize.list.literal
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