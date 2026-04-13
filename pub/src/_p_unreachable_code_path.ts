
export class Unreachable_Code_Path_Error extends Error {
    constructor(explanation: string) {
        super(`PANIC; this should have been an unreachable code path because ${explanation}`)
    }
}

export default function _p_unreachable_code_path(explanation: string): never {
    throw new Unreachable_Code_Path_Error(explanation)
}