import * as _pi from "./interface"

export default function _p_location_to_string_deprecated ($: _pi.Deprecated_Source_Location): string {
    return `${$['document resource identifier']}:${$.line}:${$.column}`
}
