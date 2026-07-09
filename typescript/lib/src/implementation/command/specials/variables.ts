
export default function <RT>(
    assign: () => RT
): RT {
    return assign()
}
