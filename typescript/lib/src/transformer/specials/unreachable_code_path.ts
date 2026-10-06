export class Unreachable_Code_Path_Error {
    constructor(
        message: string,
        stack : string | undefined,
    ) {
        this.message = message
        this.stack = stack
    }
    message: string
    stack: string | undefined
}

/**
 * The exit code of a process that reached an unreachable code path: an implementation error.
 * It matches the exit code Node.js uses for an uncaught exception.
 */
export const EXIT_CODE_IMPLEMENTATION_ERROR = 1

// pareto-core does not depend on a host; in Node.js the process is available on globalThis
type Host_Process = {
    exit: (code: number) => never
    stderr: { write: (text: string) => unknown }
}

/**
 * Marks a code path that cannot be reached; reaching it is an implementation error.
 * In Node.js it writes the explanation and the stack to stderr and exits immediately with
 * {@link EXIT_CODE_IMPLEMENTATION_ERROR}, so that it cannot be caught and mistaken for another kind of error.
 * Elsewhere it throws an {@link Unreachable_Code_Path_Error}.
 */
export default function (explanation: string): never {
    const err = new Error(explanation)
    const host_process = (globalThis as { process?: Host_Process }).process
    if (host_process !== undefined && typeof host_process.exit === 'function') {
        host_process.stderr.write(`Implementation error: unreachable code path: ${err.stack ?? explanation}\n`)
        return host_process.exit(EXIT_CODE_IMPLEMENTATION_ERROR)
    }
    throw new Unreachable_Code_Path_Error(explanation, err.stack)
}
