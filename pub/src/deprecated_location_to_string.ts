import * as _pi from "./interface"

export const _p_deprecated_location_to_string = ($: _pi.Deprecated_Source_Location): string => {
    return `${$['document resource identifier']}:${$.line}:${$.column}`
}
