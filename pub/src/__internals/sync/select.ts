import * as _pi from "../../interface"

export const entry = <T>(
    dictionary: _pi.Dictionary<T>,
    id: string,
    abort: {
        no_such_entry: _pi.Abort<null>
    }
) => {
    return dictionary.__get_entry_deprecated(id, abort)
}