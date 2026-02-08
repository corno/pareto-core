import * as _pi from "../../../../interface"

export namespace literal {

    export const resolve = <Resolved>(
        callback: (
        ) => Resolved,
    ): Resolved => callback()

}

export namespace from {

    export const list = <T>(
        $: _pi.List<T>,
    ) => {
        return {

            map_with_state: <Target_Item, State, Result_Type extends { [id: string]: any }>(
                initial_state: State,
                assign_item: (
                    value: T,
                    state: State
                ) => Target_Item,
                update_state: (
                    value: Target_Item,
                    state: State
                ) => State,
                wrapup: (
                    final_list: _pi.List<Target_Item>,
                    final_state: State
                ) => Result_Type,
            ): Result_Type => {
                let current_state = initial_state
                return wrapup(
                    $.__l_map(($) => {
                        const result = assign_item($, current_state)
                        current_state = update_state(result, current_state)
                        return result
                    }),
                    current_state
                )
            },

        }
    }

}

