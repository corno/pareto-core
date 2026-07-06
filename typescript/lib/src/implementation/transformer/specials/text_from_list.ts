import * as p_di from "../../../interface/data.js"

export default function text_from_list <T extends p_di.Value>(
    list: p_di.List<T>,
    assign_character: (item: T) => number,
) {
    let out = ""
    const chunkSize = 100000;
    const array_of_numbers = list.__get_raw().map(($) => assign_character($))
    for (let i = 0; i < array_of_numbers.length; i += chunkSize) {
        const chunk = array_of_numbers.slice(i, i + chunkSize);
        out += String.fromCharCode(...chunk);
    }
    return out
}