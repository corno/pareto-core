import * as pt from "pareto-core-types"
import * as pi from "pareto-core-internals"
import { AsyncTuple2Result, AsyncTuple3Result } from "../types/Tuples"

/**
 * this function takes 2 asynchronous values,
 * evaluates both of them and, when this is done, calls the final 'map' function
 * with both values as parameters (in a tuple)
 * @param $1 the first asynchronous value
 * @param $2 the second asynchronous value
 * @param map the function that produces the result based on the 2 evaluated values
 */
export function tuple2<T1, T2, Result>(
    $1: pt.AsyncValue<T1>,
    $2: pt.AsyncValue<T2>,
    map: ($: AsyncTuple2Result<T1, T2>) => Result,
): pt.AsyncValue<Result> {
    return pi.wrapAsyncValueImp(
        (cb) => {
            let elem1IsSet = false
            let elem2IsSet = false

            let elem1: T1
            let elem2: T2

            function wrapup() {
                if (elem1IsSet && elem2IsSet) {
                    cb(map({ first: elem1, second: elem2 }))
                }
            }
            $1.__execute((val) => {
                elem1 = val
                elem1IsSet = true
                wrapup()
            })
            $2.__execute((val) => {
                elem2 = val
                elem2IsSet = true
                wrapup()
            })
        }
    )
}

/**
 * this function takes 3 asynchronous values,
 * evaluates all 3 of them and, when this is done, calls the final 'map' function
 * with all values as parameters (in a tuple)
 * @param $1 the first asynchronous value
 * @param $2 the second asynchronous value
 * @param $3 the second asynchronous value
 * @param map the function that produces the result based on the 3 evaluated values
 */
export function tuple3<T1, T2, T3, Result>(
    $1: pt.AsyncValue<T1>,
    $2: pt.AsyncValue<T2>,
    $3: pt.AsyncValue<T3>,
    map: ($: AsyncTuple3Result<T1, T2, T3>) => Result,
): pt.AsyncValue<Result> {
    return pi.wrapAsyncValueImp(
        (cb) => {
            let elem1IsSet = false
            let elem2IsSet = false
            let elem3IsSet = false

            let elem1: T1
            let elem2: T2
            let elem3: T3

            function wrapup() {
                if (elem1IsSet && elem2IsSet && elem3IsSet) {
                    cb(map({ first: elem1, second: elem2, third: elem3 }))
                }
            }
            $1.__execute((val) => {
                elem1 = val
                elem1IsSet = true
                wrapup()
            })
            $2.__execute((val) => {
                elem2 = val
                elem2IsSet = true
                wrapup()
            })
            $3.__execute((val) => {
                elem3 = val
                elem3IsSet = true
                wrapup()
            })

        }
    )
}
