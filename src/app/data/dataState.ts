export class DataState<T = any> {
    idle = true
    loading = false
    success = false
    error = false

    init(data: T) {}

    setLoading() {
        this.idle = false
        this.loading = true
        this.success = false
        this.error = false
    }

    setSuccess() {
        this.idle = false
        this.loading = false
        this.success = true
        this.error = false
    }

    setError() {
        this.idle = false
        this.loading = false
        this.success = false
        this.error = true
    }

}