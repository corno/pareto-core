import * as p_di from "../../../../interface/data"
import { Raw_Optional_Value } from "../../../../interface/__internal/Raw_Optional_Value"


export class Not_Set_Optional_Value<T extends p_di.Value> implements p_di.Optional_Value<T> {

    public readonly __optional_value = true

    public __extract_data(
        set: ($: T) => undefined,
        not_set: () => undefined,
    ): undefined {
        return not_set()
    }

    public __get_raw() {
        return null
    }
}

export class Set_Optional_Value<T extends p_di.Value> implements p_di.Optional_Value<T> {

    constructor(source: T) {
        this.value = source
    }

    public readonly __optional_value = true

    value: T

    public __extract_data(
        set: ($: T) => undefined,
        not_set: () => undefined,
    ): undefined {
        return set(this.value)
    }

    public __get_raw(): Raw_Optional_Value<T> {
        return [this.value]
    }
}