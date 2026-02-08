import * as _pi from "../../../../interface"

export namespace from {

    export const dictionary = <T>(
        $: _pi.Dictionary<T>,
    ) => {
        return {

            is_empty: (): boolean => {
                return $.__get_number_of_entries() === 0
            }
        }
    }

    export const list = <T>(
        $: _pi.List<T>,
    ) => {
        return {
            is_empty: (): boolean => {
                return $.__get_number_of_items() === 0
            },

            reduce: (
                initial_state: boolean,
                update_state: (
                    value: T,
                    current: boolean
                ) => boolean,
            ): boolean => {
                let current_state = initial_state
                $.__get_raw_copy().forEach(($) => {
                    current_state = update_state($, current_state)
                })
                return current_state
            }

        }
    }

    export const optional = <T>(
        $: _pi.Optional_Value<T>,
    ) => {
        return {
            is_set: (): boolean => {
                return $.__decide(
                    () => true,
                    () => false
                )
            }
        }
    }

}