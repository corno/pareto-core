
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

export default function (explanation: string): never {
    const err = new Error(explanation)
    throw new Unreachable_Code_Path_Error(explanation, err.stack)
}