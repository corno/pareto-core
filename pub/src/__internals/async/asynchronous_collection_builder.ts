import * as _pi from  "../../interface"
import { List_Class } from "../sync/expression/literals/List"
import * as _p from "../../expression"

export type Asynchronous_Dictionary_Builder<Entry> = {
    'add entry': (id: string, entry: Entry) => void,
    'get dictionary': () => _pi.Dictionary<Entry>,
}

export const create_asynchronous_dictionary_builder = <Entry>(): Asynchronous_Dictionary_Builder<Entry> => {
    const entries: { [id: string]: Entry } = {}

    return {
        'add entry': (id: string, entry: Entry) => {
            entries[id] = entry
        },

        'get dictionary': () => {
            return _p.dictionary.literal(entries)
        },
    }
}

export type Asynchronous_List_Builder<Item> = {
    'add item': (item: Item) => void,
    'add list': (list: _pi.List<Item>) => void,
    'get list': () => _pi.List<Item>,
}

export const create_asynchronous_list_builder = <Item>(): Asynchronous_List_Builder<Item> => {
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