import * as p_di from "../../../../interface/data"
import { Abort } from "../../../../interface/__internal/Abort"

export namespace from {

    export namespace number {

        /**
         * Performs integer division of two numbers with configurable rounding behavior.
         * 
         * dividend / divisor
         * 
         * Rounding modes:
         * - 'towards negative infinity': floor (7.8 → 7, -7.8 → -8)
         * - 'towards positive infinity': ceiling (7.2 → 8, -7.8 → -7)
         * - 'towards zero': truncate (7.8 → 7, -7.8 → -7)
         * - 'towards nearest': round to nearest integer (7.5 → 8, 7.4 → 7)
         * - 'away from zero': round away from zero (7.2 → 8, -7.2 → -8)
         */
        export const divide = (
            $: number,
            divisor: number,
            round:
                | ['towards negative infinity', null]
                | ['towards positive infinity', null]
                | ['towards nearest', null]
                | ['towards zero', null]
                | ['away from zero', null],
            abort: {
                divided_by_zero: Abort<null>
            },
        ): number => {
            if (divisor === 0) {
                abort.divided_by_zero(null)
            }
            const quotient = $ / divisor

            switch (round[0]) {
                case 'towards negative infinity':
                    // Always round down (floor)
                    return Math.floor(quotient)

                case 'towards positive infinity':
                    // Always round up (ceiling)
                    return Math.ceil(quotient)

                case 'towards zero':
                    // Truncate decimal part (round towards zero)
                    return Math.trunc(quotient)

                case 'towards nearest':
                    // Round to nearest integer (0.5 rounds away from zero)
                    return Math.round(quotient)

                case 'away from zero':
                    // Round away from zero
                    if (quotient >= 0) {
                        return Math.ceil(quotient)
                    } else {
                        return Math.floor(quotient)
                    }

                default:
                    const _exhaustiveCheck: never = round
                    throw new Error(`Unexpected rounding mode: ${round}`)
            }
        }


    }

    export const list = <T extends p_di.Value>(
        list: p_di.List<T>,
    ) => {
        return {

            amount_of_items: (
            ): number => {
                return list.__get_number_of_items()
            },

            reduce: (
                initial_state: number,
                update_state: (
                    value: T,
                    current: number
                ) => number,
            ): number => {
                let current_state = initial_state
                list.__get_raw_copy().forEach(($) => {
                    current_state = update_state($, current_state)
                })
                return current_state
            },

            sum: (
                assign_value: (
                    item: T,
                ) => number,
            ): number => {
                let sum = 0
                list.__get_raw_copy().forEach(($) => {
                    sum += assign_value($)
                })
                return sum
            },

        }
    }

    export const dictionary = <T extends p_di.Value>(
        dictionary: p_di.Dictionary<T>,
    ) => {
        return {

            amount_of_entries: (
            ): number => {
                return dictionary.__get_number_of_entries()
            },

            sum: (
                assign_value: (
                    item: T,
                ) => number,
            ): number => {
                let sum = 0
                dictionary.__get_raw_copy().forEach(($) => {
                    sum += assign_value($[1])
                })
                return sum
            },

        }
    }


}