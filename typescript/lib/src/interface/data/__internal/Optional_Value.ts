import { Value } from "./Value"
import { Raw_Optional_Value } from "../../__internal/Raw_Optional_Value"


/**
 * Why this type and not use for example 'null | T'?
 * the 'null | T' is vulnerable. If you have a parametrized function 'foo<T>() null | T' and T is null | number,
 * you cannot discern if a return value is null because of the function or because of the data
 * this 'Optional_Value' type makes it possible to have recursive optional types like this: Optional_Value<Optional_Value<number>>
 */
export interface Optional_Value<T extends Value> {

    __optional_value: true
    
    __deprecated_extract_data(
        set: ($: T) => undefined,
        not_set: () => undefined,
    ): undefined

    __get_raw(
    ): Raw_Optional_Value<T>

}