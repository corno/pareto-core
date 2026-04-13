
export class Unreachable_Code_Path_Error {
    constructor(
        message: string,
        stack? : string,
    ) {
        this.message = message
        this.stack = stack
    }
    message: string
    stack?: string
}

export default function _p_unreachable_code_path(explanation: string): never {
    const err = new Error(explanation)
    throw new Unreachable_Code_Path_Error(explanation, err.stack)
}