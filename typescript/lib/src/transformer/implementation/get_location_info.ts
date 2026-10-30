export type Source_Location = {
    readonly 'document resource identifier': string
    readonly 'line': number
    readonly 'column': number
}

/**
 * provides the source location (filepath and line number) of the source code file where this function is called,
 * or if the depth is bigger than 0, the source location of the function at that stack depth
 * @param depth
 * @returns
 */
export default function(depth: number): Source_Location {

    //we create an error, not to be thrown but to be disected for its stack
    const e = new Error(); //don't move this statement to another function, it will change the depth of its stack

    function get_line(e: Error, depth: number): string {
        if (e.stack === undefined) {
            throw new Error(`NO STACK INFO`)
        }
        const line = e.stack.split("\n")[depth + 2]!
        const regex = /\((.*)\)$/
        const match = regex.exec(line);
        if (match !== null) {
            const result = match[1]!
            const filePrefix = "file://"
            if (result.startsWith(filePrefix)) {
                return result.substring(filePrefix.length)
            }
            return result
        }
        const beginESM = "    at file:///"
        if (line.startsWith(beginESM)) {
            return "/" + line.substring(beginESM.length)
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
        throw new Error(
            [
                "unexpected stack line format",
                " expected: 'file:line:column'",
                ` found: '${line}'`,
                " is the depth parameter set correctly?"
            ].join("\n")
        )
    }
    return {
        'document resource identifier': split[0]!,
        'line': Number(split[1]),
        'column': Number(split[2]),
    }
}
