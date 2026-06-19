
export default function variables<RT>(
    assign: () => RT
): RT {
    return assign()
}
