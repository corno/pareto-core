import { Raw_Optional_Value } from "./Raw_Optional_Value"
import { Transformer } from "./algorithm_signatures/Transformer"
import { Circular_Dependency } from "./data/Circular_Dependency"

export type Abort<Error> = (error: Error) => never

export type Iterator<Item> = {
    look: () => Raw_Optional_Value<Item>,
    look_ahead: (offset: number) => Raw_Optional_Value<Item>
    consume: <T>(
        assign: (value: Item, position: number) => T,
        abort: {
            no_more_tokens: Abort<null>
        }
    ) => T,
    discard: <T>(
        assign: () => T
    ) => T,
    get_position: () => number,
    assert_finished: <T>(
        assign: () => T,
        abort: {
            not_finished: Abort<null>
        }
    ) => T
}

export namespace lookup {

    export type Acyclic<Type> = {
        get_entry: (
            id: string,
            abort: {
                no_such_entry: Abort<null>,
                no_context_lookup: Abort<null>,
                cycle_detected: Abort<string[]>,
            }
        ) => Type
        __get_entry_raw: (
            id: string,
            abort: {
                no_context_lookup: Abort<null>,
                cycle_detected: Abort<string[]>,
            }
        ) => Raw_Optional_Value<Type>
    }

    export type Cyclic<Type> = {
        get_entry: (
            id: string,
            abort: {
                no_such_entry: Abort<string>,
                no_context_lookup: Abort<null>,
                accessing_cyclic_before_resolved: Abort<null>,
            }
        ) => Circular_Dependency<Type>
    }

    export type Stack<Type> = {
        get_entry: (
            id: string,
            abort: {
                no_context_lookup: Abort<null>,
                no_such_entry: Abort<string>,
                cycle_detected: Abort<string[]>,
            }
        ) => Type
        get_entry_depth: (
            id: string,
            abort: {
                no_context_lookup: Abort<null>,
                no_such_entry: Abort<string>,
                cycle_detected: Abort<string[]>,
            }
        ) => number
    }

}