import * as pt from 'pareto-core-types'
import * as pi from 'pareto-core-internals'

import { Stack } from "../types/Stack"

/**
 * documentation TBD
 * @param seed 
 * @returns 
 */
export function createStack<T>(seed: pt.Array<T>): Stack<T> {
    const imp: T[] = []

    seed.__forEach(($) => {
        imp.push($)
    })

    //reversing, because the first element should be on top
    imp.reverse()

    return {
        pop: (onNotEmpty, onEmpty) => {
            const current = imp.pop()
            if (current === undefined) {
                return onEmpty()
            } else {
                return onNotEmpty(current)
            }
        },
        push: (v) => {
            imp.push(v)
        },
        isEmpty: () => {
            return imp.length === 0
        },
        empty: (cb) => {
            while (true) {
                const entry = imp.pop()
                if (entry === undefined) {
                    return
                }
                cb(entry)
            }
        },
        doUntil: (
            $c
        ) => {

            while (true) {
                const res = imp.pop()

                if (res === undefined) {
                    return
                } else {
                    imp.push(res)
                    const goOn = $c(res)
                    if (!goOn) {
                        //callback()
                        return
                    }
                }
            }
        },
    }
}