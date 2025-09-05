import { signal } from "@angular/core";
import { DataState } from "./dataState";

export abstract class DataSingle<T> extends DataState<T> {
    public data = signal<T | undefined>(undefined);

    getData(): T | undefined {
        return this.data();
    }
}