import * as api from "pareto-lang-api"

// export function createDictionary<T>(source: { [key: string]: T }): api.IReadonlyDictionary<T> {
//     return {
//         // forEach: (cb) => {
//         //     Object.keys(source).sort().forEach($ => {
//         //         cb(source[$], $)
//         //     })
//         // },
//         // map: <NT>(cb: (v: T, key: string) => NT) => {
//         //     const target: { [key: string]: NT } = {}
//         //     pr.Objectkeys(source).forEach($ => {
//         //         target[$] = cb(source[$], $)
//         //     })
//         //     return createDictionaryImp(target)
//         // },
//         toArray: () => {
//             return Object.keys(source).map($ => {
//                 return {
//                     key: $,
//                     value: source[$]
//                 }
//             })
//         }
//     }
// }
