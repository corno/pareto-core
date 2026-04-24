import * as _pi from  "../../interface"
import { List_Class } from "../sync/assign/literals/List"
import * as _p from "../../assign"


export type Asynchronous_List_Builder<Item> = {
    'add item': (item: Item) => void,
    'add list': (list: _pi.List<Item>) => void,
    'get list': () => _pi.List<Item>,
}

export default function create_asynchronous_list_builder <Item>(): Asynchronous_List_Builder<Item> {
    const items: Item[] = []

    return {
        'add item': (item: Item) => {
            items.push(item)
        },
        'add list': (list: _pi.List<Item>) => {
            items.push(...list.__get_raw_copy())
        },

        'get list': () => {
            return new List_Class(items)
        },
    }
}