import * as _pi from "./interface"

export default function _p_iterate <Item, Return_Type>(
    $: _pi.List<Item>,
    assign: ($iter: _pi.Iterator<Item>) => Return_Type,
): Return_Type {

    const raw = $.__get_raw_copy()

    const length = raw.length

    let position = 0

    return assign({
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
            assign,
            abort
        ) => {
            const current = $.__deprecated_get_item_at(
                position, 
                {
                    out_of_bounds: abort.no_more_tokens
                }
            )
            position += 1            
            return assign(current, position)
        },
        discard: <T>(
            assign: () => T
        ) => {
            position += 1
            return assign()
        },
        get_position: () => {
            return position
        },
        assert_finished: (
            assign,
            abort
        ) => {
            const result = assign()
            if (position < length) {
                return abort.not_finished(null)
            }
            return result
        }
    })
}