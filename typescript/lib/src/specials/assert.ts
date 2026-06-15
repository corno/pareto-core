import { Abort } from "../__internals/Abort"
import * as p_di from "../data/interface"
/**
 * 
 * asserts for a condition, and if the condition is not met, aborts with the given error.
 * it does not have an effect on the normal data flow
 * so use this function if you want an error checking on top of the errors that are the result of the data conversion
 */
export default function assert<
    Return_Type extends p_di.Value,
    Error extends p_di.Value
>(
    abort: Abort<Error>,
    tester: () => p_di.Optional_Value<Error>,
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
