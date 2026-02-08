import * as _pi from "../../../../interface"

import { Set_Optional_Value, Not_Set_Optional_Value } from "../literals/Optional"

export function block<RT>(callback: () => _pi.Optional_Value<RT>): _pi.Optional_Value<RT> {
    return callback()
}

export namespace literal {

    export const set = <T>(value: T): _pi.Optional_Value<T> => {
        return new Set_Optional_Value(value)
    }

    export const not_set = <T>(): _pi.Optional_Value<T> => {
        return new Not_Set_Optional_Value<T>()
    }

}

export namespace from {

    export const boolean = (
        $: boolean,
    ) => {
        return {

            convert: <T>(
                value_if_set: T,
            ): _pi.Optional_Value<T> => {
                if ($) {
                    return new Set_Optional_Value<T>(value_if_set)
                } else {
                    return new Not_Set_Optional_Value<T>()
                }
            },


        }
    }

    export const optional = <T>(
        $: _pi.Optional_Value<T>,
    ) => {
        return {

            map: <New_Type>(
                handle_value: (value: T) => New_Type,
            ): _pi.Optional_Value<New_Type> => {
                return $.__decide(
                    (value) => new Set_Optional_Value(handle_value(value)),
                    () => new Not_Set_Optional_Value()
                )
            }

        }

    }

}
