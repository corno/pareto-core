import * as p_di from  "../../data/interface"
import * as _p from "../../assign"

export type Asynchronous_Dictionary_Builder<Entry extends p_di.Value> = {
    'add entry': (id: string, entry: Entry) => void,
    'get dictionary': () => p_di.Dictionary<Entry>,
}

export default function create_asynchronous_dictionary_builder <Entry extends p_di.Value>(): Asynchronous_Dictionary_Builder<Entry> {
    const entries: { [id: string]: Entry } = {}

    return {
        'add entry': (id: string, entry: Entry) => {
            entries[id] = entry
        },

        'get dictionary': () => {
            return _p.literal.dictionary(entries)
        },
    }
}
