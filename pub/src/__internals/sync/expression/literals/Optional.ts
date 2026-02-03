import * as _pi from "../../../../interface"

export class Not_Set_Optional_Value<T> implements _pi.Optional_Value<T> {

    public __decide<NT>(
        set: ($: T) => NT,
        not_set: () => NT,
    ) {
        return not_set()
    }

    public __extract_data(
        set: ($: T) => void,
        not_set: () => void,
    ): void {
        not_set()
    }
}

export class Set_Optional_Value<T> implements _pi.Optional_Value<T> {

    constructor(source: T) {
        this.value = source
    }

    public __decide<NT>(
        set: ($: T) => NT,
        not_set: () => NT,
    ) {
        return set(this.value)
    }

    public __extract_data(
        set: ($: T) => void,
        not_set: () => void,
    ): void {
        set(this.value)
    }

    value: T
}