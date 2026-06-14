import * as _pi from "../../../../interface"

export function block<RT extends _pi.State>(
    assign_option: () => RT
): RT {
    //this seems to be only used for switching on strings
    return assign_option()
}