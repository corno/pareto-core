import * as p_di from "../../../interface/data"
import { List_Class } from "../sync/assign/literals/List"


export type Asynchronous_List_Builder<
    Item extends p_di.Value
> = {
    'add item': (item: Item) => void,
    'add list': (list: p_di.List<Item>) => void,
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
            items.push(...list.__get_raw_copy())
        },

        'get list': () => {
            return new List_Class(items)
        },
    }
}