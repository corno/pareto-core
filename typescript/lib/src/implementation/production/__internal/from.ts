import * as p_di from "../../../interface/data/index.js"

export const state = <State extends p_di.State>(
    state: State,
) => {
    return {

        decide: <RT extends p_di.Value>(
            assign: (output: State) => RT
        ): RT => {
            return assign(state)
        }
        
    }
}

export const text = (
    string: string,
) => {
    return {

        state: <State extends p_di.State>(
            assign_state: ($: string) => State
        ): p_di.State => {
            return assign_state(string)
        }

    }
}