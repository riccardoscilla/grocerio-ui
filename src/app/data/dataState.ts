import { signal } from "@angular/core";

export type DataStatus = 'idle' | 'loading' | 'success' | 'error';

export abstract  class DataState<T> {
    private status = signal<DataStatus>('idle');

    abstract init(data: T | T[]): void;

    setLoading() {
        this.status.set('loading');
    }

    setSuccess() {
        this.status.set('success');
    }

    setError() {
        this.status.set('error');
    }

    getStatus() {
        return this.status.asReadonly();
    }
}