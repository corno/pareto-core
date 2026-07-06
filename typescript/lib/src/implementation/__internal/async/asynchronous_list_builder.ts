import * as p_di from "../../../interface/data.js"
import { List_Class } from "../sync/primitives/List.js"


export type Asynchronous_List_Builder<
    Item extends p_di.Value
> = {
    'add item': (item: Item) => undefined,
    'add list': (list: p_di.List<Item>) => undefined,
    'get list': () => p_di.List<Item>,
}

export default function create_asynchronous_list_builder<
    Item extends p_di.Value
>(): Asynchronous_List_Builder<Item> {
    const items: Item[] = []

    return {
        'add item': (item: Item) => {
            items.push(item)
        },
        'add list': (list: p_di.List<Item>) => {
            items.push(...list.__get_raw())
        },

        'get list': () => {
            return new List_Class(items)
        },
    }
}