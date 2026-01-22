import * as _pi from "../../interface"

/**
 * provides the source location (filepath and line number) of the source code file where this function is called,
 * or if the depth is bigger than 0, the source location of the function at that stack depth
 * @param depth 
 * @returns 
 */
export function $$(depth: number): _pi.Deprecated_Source_Location {

    //we create an error, not to be thrown but to be disected for its stack
    const e = new Error(); //don't move this statement to another function, it will change the depth of its stack


    function get_line(e: Error, depth: number): string {


        if (e.stack === undefined) {
            throw new Error(`NO STACK INFO`)
        }
        const line = e.stack.split("\n")[depth + 2]  //get the right line from the stack (the first two lines are "Error" and this function call)

        const regex = /\((.*)\)$/ //matches the content inside parentheses at the end of a line (the file path with line and column)

        const match = regex.exec(line);

        if (match !== null) {
            //we have a match
            return match[1]
        }

        const begin = "    at /"
        if (line.startsWith(begin)) {
            return line.substring(begin.length - 1)
        }

        throw new Error(`COULD NOT PARSE STACK LINE: ${line}`)


    }
    
    const line = get_line(e, depth)
    const split = line.split(":")
    if (split.length !== 3) {
        throw new Error(`UNEXPECTED LOCATION FORMAT (CHECK THE DEPTH PARAMETER): ${line} (Expected 'file:line:column')`)
    }
    return {
        'file': split[0],
        'line': Number(split[1]),
        'column': Number(split[2]),
    }
}