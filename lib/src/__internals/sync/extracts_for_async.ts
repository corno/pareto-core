
import * as assign from "../../assign"

export namespace dictionary {

    export const literal = assign.dictionary.literal
}

export namespace integer {

}

export namespace list {

    export const literal = assign.list.literal
    export const nested_literal = assign.list.nested_literal_old

}

export namespace natural {

}

export namespace optional {

    export namespace literal {

        export const set = assign.optional.literal.set
        export const not_set = assign.optional.literal.not_set

    }

}

export namespace text {

}