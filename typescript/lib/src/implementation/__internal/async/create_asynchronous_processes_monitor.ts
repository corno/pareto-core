
export type I_Async_Monitor = {
    readonly report_process_started: () => undefined
    readonly report_process_finished: () => undefined
}

/**
 * this function helps in keeping track of ongoing async operations
 * async operations are registered and when finished reported as such.
 * when all ongoing operations are finished the onEnd callback is called
 * 
 * this function is specifically useful for async map functions
 * 
 * @param callback this callback creates a scope within which the counter is provided
 * @param onEnd this callback will be called when all ongoing operations are finished
 */
export default function (
    parameters: {
        monitoring_phase: ($: I_Async_Monitor) => undefined,
        on_all_finished: () => undefined
    }
): undefined {

    let running_processes_counter = 0

    /*
     * we need to keep track of if the registration phase is ended or not.
     * it can happen that the counter reaches 0 during the registration phase, specifically if there is no real async calls being made
     * in that case the counter is already called during the registration phase.
     * If that happens there should not yet be a call to onEnd().
     */
    let registration_phase_ended = false
    let on_all_finished_has_been_called = false

    function checkStatus() {
        if (registration_phase_ended) {

            if (running_processes_counter === 0) {
                if (on_all_finished_has_been_called === true) {
                    throw new Error("CORE: already ended")
                }
                on_all_finished_has_been_called = true
                parameters.on_all_finished()
            }
        }
    }
    parameters.monitoring_phase({
        'report_process_started': () => {
            if (on_all_finished_has_been_called) {
                throw new Error("CORE: async call done after context is ready")
            }
            running_processes_counter += 1

        },
        'report_process_finished': () => {
            if (running_processes_counter === 0) {
                throw new Error("CORE: decrement while counter is 0")
            }
            running_processes_counter -= 1
            checkStatus()
        },
    })
    registration_phase_ended = true
    checkStatus()
}
