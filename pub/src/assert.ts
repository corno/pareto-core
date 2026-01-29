import * as _pi from "./interface"


export function assert<Return_Type, Error>(
    abort_callback: _pi.Abort<Error>,
    tester: () => _pi.Optional_Value<Error>,
    normal_flow: () => Return_Type
): Return_Type {
    const test_result = tester()
    test_result.__extract_data(
        ($) => {
            abort_callback($)
        },
        () => {

        }
    )
    return normal_flow()
}
