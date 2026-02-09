

export function block<RT extends readonly [string, any]>(
    assign_option: () => RT
): RT {
    //this seems to be only used for switching on strings
    return assign_option()
}