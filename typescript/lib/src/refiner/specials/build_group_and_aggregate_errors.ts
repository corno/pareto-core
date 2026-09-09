import * as p_di from "../../schema.js"
import { type Abort } from "../../__internal/Abort.js"
import * as lit from "../../__internal/sync/literal.js"

type RefinerResult<R> =
    R extends (abort: Abort<any>) => infer Result
    ? Result
    : never

class My_Error extends Error { }

export default function build_and_aggregate_errors<
    Error extends p_di.Value,
>() {
    return function <
        const T extends readonly ((abort: Abort<Error>) => unknown)[],
        Result
    >(
        refiners: [...T],
        on_errors: ($: p_di.List<Error>) => never,
        on_success: ($: { [K in keyof T]: RefinerResult<T[K]> }) => Result,
    ): Result {
        const results: unknown[] = []
        const errors: Error[] = []

        refiners.forEach((refiner, index) => {
            try {
                results[index] = refiner(
                    ($) => {
                        errors.push($)
                        throw new My_Error()
                    },
                )
            } catch (e) {
                if (!(e instanceof My_Error)) {
                    throw e
                }
            }
        })

        if (errors.length > 0) {
            return on_errors(lit.list(errors))
        } else {
            return on_success(results as { [K in keyof T]: RefinerResult<T[K]> })
        }

    }
}

// // -----------------------------------------------------------------------------
// // Example
// // -----------------------------------------------------------------------------

// const build = build_and_aggregate_errors<string>()


// type My_Object = {
//     'a': number,
//     'b': string,
//     'c': boolean,
//     'd': number,
// }

// export const my_object: My_Object = build(
//     [
//         (abort) => 42,
//         (abort) => "hello",
//         (abort) => true,
//         (abort) => abort("something happened"),
//     ],
//     (errors) => {
//         throw new Error()
//     },
//     ([a, b, c, d]) => ({
//         'a': a,
//         'b': b,
//         'c': c,
//         'd': d,
//     })
// )