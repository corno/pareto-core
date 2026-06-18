import * as p_di from "../../../interface/data"
import * as p_ri from "../../../interface/refiner"
import { Abort } from "../../../interface/__internal/Abort"
import * as lit from "./literal"


export const boolean = (
    boolean_value: boolean,
) => {
    return {



    }
}

export const dictionary = <T extends p_di.Value>(
    dictionary: p_di.Dictionary<T>,
) => {
    return {


    }
}

export const list = <T extends p_di.Value>(
    list: p_di.List<T>,
) => {
    return {


    }
}

export namespace number {

}

export const number = (
    number: number,
) => {
    return {
    }
}

export const optional = <T extends p_di.Value>(
    optional_value: p_di.Optional_Value<T>,
) => {
    return {
    }
}



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