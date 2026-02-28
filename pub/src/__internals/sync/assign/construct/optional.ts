import * as _pi from "../../../../interface"

import { Set_Optional_Value, Not_Set_Optional_Value } from "../literals/Optional"

export function block<RT>(
    assign_optional_value: () => _pi.Optional_Value<RT>
): _pi.Optional_Value<RT> {
    return assign_optional_value()
}

export namespace literal {

    export const set = <T>(
        value: T
    ): _pi.Optional_Value<T> => {
        return new Set_Optional_Value(value)
    }

    export const not_set = <T>(
    ): _pi.Optional_Value<T> => {
        return new Not_Set_Optional_Value<T>()
    }

}

export namespace from {

    export const boolean = (
        boolean_value: boolean,
    ) => {
        return {

            convert: <T>(
                assign_set: () => T,
            ): _pi.Optional_Value<T> => {
                if (boolean_value) {
                    return new Set_Optional_Value<T>(assign_set())
                } else {
                    return new Not_Set_Optional_Value<T>()
                }
            },


        }
    }

    export const optional = <T>(
        optional_value: _pi.Optional_Value<T>,
    ) => {
        return {

            map: <New_Type>(
                assign_set_value: (
                    value: T
                ) => New_Type,
            ): _pi.Optional_Value<New_Type> => {
                return optional_value.__decide(
                    (value): _pi.Optional_Value<New_Type> => new Set_Optional_Value(assign_set_value(value)),
                    () => new Not_Set_Optional_Value()
                )
            }

        }

    }

}
