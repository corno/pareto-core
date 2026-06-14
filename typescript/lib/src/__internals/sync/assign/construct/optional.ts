import * as p_di from "../../../../data/interface"

import { Set_Optional_Value, Not_Set_Optional_Value } from "../literals/Optional"

export function block<RT extends p_di.Value>(
    assign_optional_value: () => p_di.Optional_Value<RT>
): p_di.Optional_Value<RT> {
    return assign_optional_value()
}

export namespace literal {

    export const set = <T extends p_di.Value>(
        value: T
    ): p_di.Optional_Value<T> => {
        return new Set_Optional_Value(value)
    }

    export const not_set = <T extends p_di.Value>(
    ): p_di.Optional_Value<T> => {
        return new Not_Set_Optional_Value<T>()
    }

}

export namespace from {

    export const boolean = (
        boolean_value: boolean,
    ) => {
        return {

            convert: <T extends p_di.Value>(
                assign_set: () => T,
            ): p_di.Optional_Value<T> => {
                if (boolean_value) {
                    return new Set_Optional_Value<T>(assign_set())
                } else {
                    return new Not_Set_Optional_Value<T>()
                }
            },


        }
    }

    export const optional = <T extends p_di.Value>(
        optional_value: p_di.Optional_Value<T>,
    ) => {
        return {

            map: <New_Type extends p_di.Value>(
                assign_set_value: (
                    value: T
                ) => New_Type,
            ): p_di.Optional_Value<New_Type> => {
                return optional_value.__decide(
                    (value): p_di.Optional_Value<New_Type> => new Set_Optional_Value(assign_set_value(value)),
                    () => new Not_Set_Optional_Value()
                )
            }

        }

    }

}
