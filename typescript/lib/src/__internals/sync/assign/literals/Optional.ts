import * as p_di from "../../../../data/interface"


export class Not_Set_Optional_Value<T extends p_di.Value> implements p_di.Optional_Value<T> {

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

    public __get_raw() {
        return null
    }
}

export class Set_Optional_Value<T extends p_di.Value> implements p_di.Optional_Value<T> {

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

    public __get_raw(): p_di.Raw_Optional_Value<T> {
        return [this.value]
    }

    value: T
}