import * as _pi from  "../../interface"
import { $$ as dictionary_literal } from '../sync/expression/literals/dictionary'
import { $$ as list_literal } from '../sync/expression/literals/list'

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
            return dictionary_literal(entries)
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
            list.__for_each(($) => {
                items.push($)
            })
        },

        'get list': () => {
            return list_literal(items)
        },
    }
}