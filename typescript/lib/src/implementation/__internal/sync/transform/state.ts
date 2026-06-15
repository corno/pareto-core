import * as p_di from "../../../../interface/data"

export function block<RT extends p_di.State>(
    assign_option: () => RT
): RT {
    //this seems to be only used for switching on strings
    return assign_option()
}