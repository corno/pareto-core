import * as p_di from "../../../interface/data/index.js"
import * as lit from "../sync/literal.js"
export type Asynchronous_Dictionary_Builder<Entry extends p_di.Value> = {
    'add entry': (id: string, entry: Entry) => undefined,
    'get dictionary': () => p_di.Dictionary<Entry>,
}

export default function create_asynchronous_dictionary_builder<Entry extends p_di.Value>(): Asynchronous_Dictionary_Builder<Entry> {
    const entries: { [id: string]: Entry } = {}

    return {
        'add entry': (id: string, entry: Entry) => {
            entries[id] = entry
        },

        'get dictionary': () => {
            return lit.dictionary(entries)

            // return new Dictionary_Class()
        },
    }
}
