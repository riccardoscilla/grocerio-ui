
export class DataStateHandler {
    states = new Map<any, any>()

    add(obj: any) {
        this.states.set(obj, obj)
    }

    addAndLoading(obj: any) {
        obj.setLoading()
        this.states.set(obj, obj)
    }

    setSuccess(obj: any) {
        this.states.get(obj)!.setSuccess()
    }

    setError(obj: any) {
        this.states.get(obj)!.setError()
    }

    isLoading() {
        return Array.from(this.states.values()).some(value => value.loading === true)
    }

    isSuccess() {
        return Array.from(this.states.values()).every(value => value.success === true)
    }

    isError() {
        return Array.from(this.states.values()).some(value => value.error === true)
    }

    
}
