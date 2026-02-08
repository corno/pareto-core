import * as _pi from "../../../../interface"


export namespace integer {

    /**
     * Performs integer division of two numbers (rounding towards negative infinity).
     * 
     * dividend / divisor
     * 
     * examples:
     * integer_division(7, 3) === 2
     * integer_division(7, -3) === -3
     * integer_division(-7, 3) === -3
     * integer_division(-7, -3) === 2
     */
    export const divide = (
        dividend: number,
        divisor: number,
        abort: _pi.Abort<['divide by zero', null]>,
    ): number => {
        if (divisor === 0) {
            abort(['divide by zero', null])
        }
        const quotient = dividend / divisor
        // when dividend and divisor have different signs, the quotient is negative
        // For positive quotients, use Math.floor to round down

        // this behavior matches the integer division in Python, Java, and C99 and later

        if (quotient >= 0) {
            return Math.floor(quotient)
        } else {
            return Math.ceil(quotient)
        }
    }
}

export namespace natural {


    export namespace from {

        export const dictionary = <T>(
            $: _pi.Dictionary<T>,
        ) => {
            return {

                amount_of_entries: (): number => {
                    return $.__get_number_of_entries()
                }

            }
        }

        export const list = <T>(
            $: _pi.List<T>,
        ) => {
            return {

                amount_of_items: (): number => {
                    return $.__get_number_of_items()
                },

                reduce: (
                    initial_state: number,
                    update_state: (
                        value: T,
                        current: number
                    ) => number,
                ): number => {
                    let current_state = initial_state
                    $.__get_raw_copy().forEach(($) => {
                        current_state = update_state($, current_state)
                    })
                    return current_state
                }

            }
        }

    }

}