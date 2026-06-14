import * as p_di from "../../../../data/interface"

export namespace from {

    export const dictionary = <T extends p_di.Value>(
        dictionary: p_di.Dictionary<T>,
    ) => {
        return {

            is_empty: (): boolean => {
                return dictionary.__get_number_of_entries() === 0
            }
        }
    }

    export const list = <T extends p_di.Value>(
        list: p_di.List<T>,
    ) => {
        return {
            is_empty: (): boolean => {
                return list.__get_number_of_items() === 0
            },

            reduce: (
                initial_state: boolean,
                update_state: (
                    value: T,
                    current: boolean
                ) => boolean,
            ): boolean => {
                let current_state = initial_state
                list.__get_raw_copy().forEach(($) => {
                    current_state = update_state($, current_state)
                })
                return current_state
            }

        }
    }

    export const optional = <T extends p_di.Value>(
        optional: p_di.Optional_Value<T>,
    ) => {
        return {
            is_set: (): boolean => {
                return optional.__decide(
                    () => true,
                    () => false
                )
            }
        }
    }

}