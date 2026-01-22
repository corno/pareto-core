import * as _pi from "../../../../interface"

export function not_set<T>(): _pi.Optional_Value<T> {
    /**
     * this is an implementation, not public by design
     */
    class Not_Set_Value<T> implements _pi.Optional_Value<T> {

        public __decide<NT>(
            set: ($: T) => NT,
            not_set: () => NT,
        ) {
            return not_set()
        }

        public __o_map<NT>(
        ) {
            return not_set<NT>()
        }

        public __is_set(): boolean {
            return false
        }

        public __extract_data(
            set: ($: T) => void,
            not_set: () => void,
        ): void {
            not_set()
        }
    }

    return new Not_Set_Value()
}
export function set<T>($: T): _pi.Optional_Value<T> {
    /**
     * this is an implementation, not public by design
     */
    class Set_Value<T> implements _pi.Optional_Value<T> {

        constructor(source: T) {
            this.value = source
        }

        public __decide<NT>(
            set: ($: T) => NT,
            not_set: () => NT,
        ) {
            return set(this.value)

        }

        public __o_map<NT>(
            if_set: ($: T) => NT,
        ) {
            return set(if_set(this.value))
        }

        public __is_set(): boolean {
            return true
        }

        public __extract_data(
            set: ($: T) => void,
            not_set: () => void,
        ): void {
            set(this.value)
        }

        value: T
    }

    return new Set_Value($)
}
