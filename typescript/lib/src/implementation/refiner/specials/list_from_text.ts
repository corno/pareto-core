import * as p_di from "../../../interface/data/index.js"

import { List_Class } from "../../__internal/sync/primitives/List.js"

export default function list_from_text  <T extends p_di.Value>(
    $: string,
    assign_item: ($: number) => T
): p_di.List<T> {
    const out: T[] = []
    for (let i = 0; i < $.length; i++) {
        out.push(assign_item($.charCodeAt(i)))
    }
    return new List_Class(out)
}