import * as p_di from "../../../interface/data.js"

export default function <T extends p_di.Value>(
    dictionary: p_di.Dictionary<T>,
    suffix: string,
) {
   const out: { [key: string]: T } = {}
   dictionary.__get_raw().forEach(($) => {
       out[$[0] + suffix] = $[1]
   })
   return out
}