import type * as p_di from "../../schema.js"
import * as lit from "./initialize.js"

export function resolve_list<Input extends p_di.Value, Result extends p_di.Value>(
    input: p_di.List<Input>,
    assign_item: (
        item: Input,
        preceding: p_di.Optional_Value<Result>,
    ) => Result,
): p_di.List<Result> {
    let preceding = lit.not_set<Result>()
    return lit.list(input.__get_raw().map(item => {
        const result = assign_item(item, preceding)
        preceding = lit.set(result)
        return result
    }))
}
