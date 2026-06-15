import * as p_di from  "../../../interface/data"
import * as p_a from "../../../assign"

export type Asynchronous_Dictionary_Builder<Entry extends p_di.Value> = {
    'add entry': (id: string, entry: Entry) => undefined,
    'get dictionary': () => p_di.Dictionary<Entry>,
}

export default function create_asynchronous_dictionary_builder <Entry extends p_di.Value>(): Asynchronous_Dictionary_Builder<Entry> {
    const entries: { [id: string]: Entry } = {}

    return {
        'add entry': (id: string, entry: Entry) => {
            entries[id] = entry
        },

        'get dictionary': () => {
            return p_a.literal.dictionary(entries)
        },
    }
}
