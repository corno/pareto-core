import * as _pi from "./interface"

export default function _p_iterate <Item, Return_Type>(
    $: _pi.List<Item>,
    handler: ($iter: _pi.Iterator<Item>) => Return_Type,
): Return_Type {

    const raw = $.__get_raw_copy()

    const length = raw.length

    let position = 0

    return handler({
        look: () => {
            if (position < 0 || position >= raw.length) {
                return null
            }
            return [raw[position]]
        },
        look_ahead: (offset: number) => {
            if (position + offset < 0 || position + offset >= raw.length) {
                return null
            }
            return [raw[position + offset]]
        },
        consume: (
            callback,
            abort
        ) => {
            const current = $.__deprecated_get_item_at(
                position, 
                {
                    out_of_bounds: abort.no_more_tokens
                }
            )
            position += 1            
            const result = callback(current, position)
            return result
        },
        discard: <T>(
            callback: () => T
        ) => {
            position += 1
            return callback()
        },
        get_position: () => {
            return position
        },
        assert_finished: (
            callback,
            abort
        ) => {
            const result = callback()
            if (position < length) {
                return abort.not_finished(null)
            }
            return result
        }
    })
}