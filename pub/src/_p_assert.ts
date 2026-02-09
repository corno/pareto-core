import * as _pi from "./interface"


export default function _p_assert<Return_Type, Error>(
    abort: _pi.Abort<Error>,
    tester: () => _pi.Optional_Value<Error>,
    assign: () => Return_Type
): Return_Type {
    const test_result = tester()
    test_result.__extract_data(
        ($) => {
            abort($)
        },
        () => {

        }
    )
    return assign()
}
