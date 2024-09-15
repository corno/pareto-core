import * as pt from 'pareto-core-types'
import * as pi from 'pareto-core-internals'

import * as process from "process"


export function runProgram(
    $c: ($: {
        readonly "arguments": pt.Array<string>;
    }) => void
): void {

    //process.stderr.setEncoding('utf-8')
    const sc = $c(
        {
            arguments: pi.wrapRawArray(process.argv.slice(2))//strip 'node' and the script name
        },
        // { 
        //     stderr: {
        //         write: ($) => {
        //             process.stderr.write($)
        //         }
        //     },
        //     stdout: {
        //         write: ($) => {
        //             process.stdout.write($)
        //         }
        //     },
        //     setExitCodeToFailed: () => {
        //         process.exit(1)
        //     }
        // }
    )

    // process.stdin.setEncoding("utf-8")
    // process.stdin.pipe(
    //     new stream.Writable({
    //         defaultEncoding: "utf-8",
    //         write: function (data, _encoding, callback) {
    //             //eslint-disable-next-line
    //             sc.onData(data.toString())
    //             callback()
    //         },
    //     })
    // ).on('finish', () => {
    //     sc.onEnd(null)
    // })
}