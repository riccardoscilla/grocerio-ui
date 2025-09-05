export class DataUtils<T extends Record<string, any>> {
    private items: T[];

    constructor(items: T[]) {
        this.items = items;
    }

    static create<T extends Record<string, any>>(items: T[]) {
        return new DataUtils(items);
    }

    private getValue(key: string, item: T) {
        return key.split('.').reduce((acc: any, part: any) => acc?.[part], item);
    }

    sort(key: string): this {
        this.items.sort((a, b) => {
            const aValue = this.getValue(key, a);
            const bValue = this.getValue(key, b);

            if (aValue == null) return 1;
            if (bValue == null) return -1;

            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        });
        return this;
    }

    groupAndFlatten(key: string): this {
        const grouped: Record<string, T[]> = {};

        this.items.forEach(item => {
            const value = this.getValue(key, item);
            const groupKey = value ?? 'undefined';

            if (!grouped[groupKey]) grouped[groupKey] = [];
            (grouped[groupKey] as T[]).push(item);
        });

        this.items = Object.values(grouped).flat();
        return this;
    }

    search(key: string, searchText: string): this {
        const search = searchText.trim().toLowerCase();
        if (search.length > 0) {
            this.items = this.items.filter(item => {
                const value = this.getValue(key, item);
                return value.toLowerCase().includes(search);
            });
        }
        return this;
    }


    get(): T[] {
        return this.items;
    }
}