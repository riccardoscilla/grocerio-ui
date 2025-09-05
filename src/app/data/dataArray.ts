import { signal } from "@angular/core";
import { DataState } from "./dataState";

export abstract class DataArray<T> extends DataState<T> {
    public data = signal<T[]>([]);

    getData(): T[] {
        return this.data();
    }

    isEmpty(): boolean {
        return this.getData().length === 0;
    }

    // Helper generico per update
    update(data: T[], idKey: keyof T = 'id' as keyof T) {
        const current = this.getData();
        const map = new Map(current.map(i => [i[idKey], i]));
        data.forEach(i => map.set(i[idKey], i));
        this.data.set(Array.from(map.values()) as T[]);
    }

    delete(data: T[], idKey: keyof T = 'id' as keyof T) {
        const current = this.getData();
        const idsToDelete = new Set(data.map(i => i[idKey]));
        this.data.set(current.filter(i => !idsToDelete.has(i[idKey])));
    }

    existBy<K extends keyof T>(prop: K, value: T[K]): boolean {
        return this.getBy(prop, value) !== undefined;
    }

    getBy<K extends keyof T>(prop: K, value: T[K]): T | undefined {
        if (value === null || value === undefined) return undefined;

        const valStr = String(value).toLowerCase().trim();
        return this.getData().find(item => String(item[prop]).toLowerCase().trim() === valStr);
    }
}