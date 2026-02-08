

export function block<RT extends readonly [string, any]>(callback: () => RT): RT {
    //this seems to be only used for switching on strings
    return callback()
}