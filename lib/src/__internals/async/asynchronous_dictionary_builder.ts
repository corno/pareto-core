import * as _pi from  "../../interface"
import * as _p from "../../assign"

export type Asynchronous_Dictionary_Builder<Entry> = {
    'add entry': (id: string, entry: Entry) => void,
    'get dictionary': () => _pi.Dictionary<Entry>,
}

export default function create_asynchronous_dictionary_builder <Entry>(): Asynchronous_Dictionary_Builder<Entry> {
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
