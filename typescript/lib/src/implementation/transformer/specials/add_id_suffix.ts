import * as p_di from "../../../interface/data.js"

import { Dictionary_Class } from "../../__internal/sync/primitives/Dictionary.js"

export default function <T extends p_di.Value>(
    dictionary: p_di.Dictionary<T>,
    suffix: string,
): p_di.Dictionary<T> {
   return new Dictionary_Class(
    dictionary.__get_raw().map(($) => [$[0] + suffix, $[1]])
   )
}