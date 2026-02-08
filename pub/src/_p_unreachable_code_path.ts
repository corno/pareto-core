export default function _p_unreachable_code_path(explanation: string): never {
    throw new Error(`PANIC; this should have been an unreachable code path because ${explanation}`)
}