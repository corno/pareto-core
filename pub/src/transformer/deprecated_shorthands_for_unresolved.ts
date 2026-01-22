import * as _pi from "../interface"

import { $$ as get_location_info } from "../__internals/sync/get_location_info"
import { $$ as dictionary_literal } from "../__internals/sync/expression/literals/dictionary"
import { $$ as list_literal } from "../__internals/sync/expression/literals/list"

const depth = 1

export const location = (): _pi.Deprecated_Source_Location => {
    return get_location_info(depth)
}

export type Raw_Or_Normal_Dictionary<T> = { [key: string]: T } | _pi.Dictionary<T>
export type Raw_Or_Normal_List<T> = T[] | _pi.List<T>
export type Raw_Dictionary<T> = { [key: string]: T }

export type Reference_To_Normal_Dictionary_Entry<G_Source, T_Dictionary_Entry> = {
    readonly 'key': string
    readonly 'location': G_Source
}

export type Reference_To_Stacked_Dictionary_Entry<G_Source, T_Dictionary_Entry> = {
    readonly 'key': string
    readonly 'location': G_Source
}

export const to_raw_array = <T>($: _pi.List<T>): readonly T[] => $.__get_raw_copy()


export type Dictionary<G_Source, T_D> = {
    readonly 'dictionary': _pi.Dictionary<{
        readonly 'entry': T_D
        readonly 'location': G_Source
    }>
    readonly 'location': G_Source
}

export type List<G_Source, T_L> = {
    readonly 'list': _pi.List<{
        readonly 'element': T_L
        readonly 'location': G_Source
    }>
    readonly 'location': G_Source
}


export const wrap_dictionary = <T>(
    $: Raw_Or_Normal_Dictionary<T>,
): Dictionary<_pi.Deprecated_Source_Location, T> => {
    const location = get_location_info(depth)
    function is_normal($: Raw_Or_Normal_Dictionary<T>): $ is _pi.Dictionary<T> {
        return $.__get_number_of_entries !== undefined && typeof $.__get_number_of_entries === "function"
    }
    if (is_normal($)) {
        return {
            'location': location,
            'dictionary': $.__d_map(($) => ({
                'location': location,
                'entry': $,
            }))
        }
    } else {
        return {
            'location': location,
            'dictionary': dictionary_literal($).__d_map(($) => ({
                'location': location,
                'entry': $,
            }))
        }
    }
}

export const wrap_list = <T>(
    $: Raw_Or_Normal_List<T>,
): List<_pi.Deprecated_Source_Location, T> => {
    const location = get_location_info(depth)
    const decorated: _pi.List<T> = $ instanceof Array
        ? list_literal($)
        : $

    if (!(decorated.__for_each instanceof Function)) {
        throw new Error("invalid input in 'wrap_list'")
    }
    return {
        'location': location,
        'list': decorated.__l_map(($) => ({
            'location': location,
            'element': $,
        }))
    }
}

export const wrap_state_group = <T>(
    $: T,
) => {
    return {
        'location': get_location_info(depth),
        'state group': $,
    }
}

export const wrap_reference = <T>(
    $: string,
): Reference_To_Normal_Dictionary_Entry<_pi.Deprecated_Source_Location, T> => {
    return {
        'location': get_location_info(depth),
        'key': $,
    }
}

export const wrap_stack_reference = <T>(
    name: string,
): Reference_To_Stacked_Dictionary_Entry<_pi.Deprecated_Source_Location, T> => {
    return {
        'location': get_location_info(depth),
        'key': name,
    }
}