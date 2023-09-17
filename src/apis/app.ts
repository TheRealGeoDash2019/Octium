enum InstallState {
    DISABLED = "disabled",
    INSTALLED = "installed",
    NOT_INSTALLED = "not_installed"
}

enum RunningState {
    CANNOT_RUN = "cannot_run",
    READY_TO_RUN = "ready_to_run",
    RUNNING = "running"
}

function generateError(funcName: string, params: string, reason: string = "No matching signature.") {
    return new TypeError(`Error in invocation of app.${funcName}(${params}): ${reason}`)
}

export default {
    InstallState,
    RunningState
}