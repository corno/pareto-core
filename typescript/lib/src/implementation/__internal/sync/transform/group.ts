import * as p_di from "../../../../interface/data"


export namespace from {

    export const list = <T extends p_di.Value>(
        list: p_di.List<T>,
    ) => {
        return {

            map_with_state: <
                Target_Item extends p_di.Value,
                State,
                Result_Type extends { [id: string]: p_di.Value }>(
                    initial_state: State,
                    assign_item: (
                        item: T,
                        state: State
                    ) => Target_Item,
                    update_state: (
                        item: Target_Item,
                        state: State
                    ) => State,
                    wrapup: (
                        final_list: p_di.List<Target_Item>,
                        final_state: State
                    ) => Result_Type,
                ): Result_Type => {
                let current_state = initial_state
                return wrapup(
                    list.__l_map(($) => {
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

