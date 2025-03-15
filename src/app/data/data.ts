import { Category } from "../model/category";
import { Item } from "../model/item";
import { ListItem } from "../model/listItem";
import { Shelf } from "../model/shelf";
import { ShelfItem } from "../model/shelfItem";
import { DataState } from "./dataState";

export class ItemsData extends DataState<Item[]> {
    items: Item[]
    filteredItems: Item[]

    searchText: string = ''
    prevCategories: Category[] = []
    selectedCategories: Category[] = []

    override init(items: Item[]) {
        this.set(items)
        this.sortByName()
        this.groupByCategory()
    }

    set(items: Item[]) {
        this.items = items
        this.filteredItems = items
    }

    sortByName() {
        this.filteredItems.sort((a, b) => a.name.localeCompare(b.name))
    }

    groupByCategory() {
        const grouped = {} as { [key: string]: Item[] }

        this.filteredItems.forEach(item => {
            const key = item.category.id
            grouped[key] = grouped[key] || []
            grouped[key].push(item)
        });

        this.filteredItems = Object.values(grouped).flat();
    }

    filter() {
        this.init(this.items)

        if (this.selectedCategories.length > 0) {
            const ids = this.selectedCategories.map(c => c.id)
            this.filteredItems = this.filteredItems.filter(item => ids.includes(item.category.id))
        }
    
        if (this.searchText.length > 0) {
            this.filteredItems = this.filteredItems.filter(item => item.name.toLowerCase().includes(this.searchText.toLocaleLowerCase()))
        }
    }

}

export class CategoriesData extends DataState<Category[]> {
    categories: Category[]
    filteredCategories: Category[]

    searchText: string = ''

    isEmpty() {
        return this.filteredCategories.length === 0;
    }

    override init(categories: Category[]) {
        this.categories = categories
        this.filteredCategories = categories
        this.sortByName()
    }

    sortByName() {
        this.categories.sort((a, b) => a.name.localeCompare(b.name))
    }

    filter() {
        this.init(this.categories)
    
        if (this.searchText.length > 0) {
            this.filteredCategories = this.filteredCategories.filter(category => category.name.toLowerCase().includes(this.searchText.toLocaleLowerCase()))
        }
    }
}


export class ShelfItemsData extends DataState<ShelfItem[]> {
    shelfItems: ShelfItem[]
    filteredShelfItems: ShelfItem[]

    searchText: string = ''
    selectedCategories: Category[] = []

    isEmpty() {
        return this.filteredShelfItems.length === 0;
    }

    override init(shelfItems: ShelfItem[]) {
        this.shelfItems = shelfItems
        this.filteredShelfItems = shelfItems
        this.sortByName()
        this.groupByCategory()
    }

    sortByName() {
        this.filteredShelfItems.sort((a, b) => a.name.localeCompare(b.name))
    }

    groupByCategory() {
        const grouped = {} as { [key: string]: ShelfItem[] }

        this.filteredShelfItems.forEach(item => {
            const key = item.category.id
            grouped[key] = grouped[key] || []
            grouped[key].push(item)
        });

        this.filteredShelfItems = Object.values(grouped).flat();
    }

    filter() {
        this.init(this.shelfItems)

        if (this.selectedCategories.length > 0) {
            const ids = this.selectedCategories.map(c => c.id)
            this.filteredShelfItems = this.filteredShelfItems.filter(item => ids.includes(item.category.id))
        }
    
        if (this.searchText.length > 0) {
            this.filteredShelfItems = this.filteredShelfItems.filter(item => item.name.toLowerCase().includes(this.searchText.toLocaleLowerCase()))
        }
    }
}

export class ListItemsData extends DataState<ListItem[]> {
    listItems: ListItem[]
    filteredListItems: ListItem[]

    searchText: string = ''
    selectedCategories: Category[] = []

    isEmpty() {
        return this.filteredListItems.length === 0;
    }

    override init(listItems: ListItem[]) {
        this.listItems = listItems
        this.filteredListItems = listItems
        this.sortByName()
        this.groupByCategory()
    }

    sortByName() {
        this.filteredListItems.sort((a, b) => a.name.localeCompare(b.name))
    }

    groupByCategory() {
        const grouped = {} as { [key: string]: ListItem[] }

        this.filteredListItems.forEach(item => {
            const key = item.category.id
            grouped[key] = grouped[key] || []
            grouped[key].push(item)
        });

        this.filteredListItems = Object.values(grouped).flat();
    }

    filter() {
        this.init(this.listItems)

        if (this.selectedCategories.length > 0) {
            const ids = this.selectedCategories.map(c => c.id)
            this.filteredListItems = this.filteredListItems.filter(item => ids.includes(item.category.id))
        }
    
        if (this.searchText.length > 0) {
            this.filteredListItems = this.filteredListItems.filter(item => item.name.toLowerCase().includes(this.searchText.toLocaleLowerCase()))
        }
    }
}

export class ShelfData extends DataState<Shelf> {
    shelf?: Shelf

    override init(shelf: Shelf) {
        this.shelf = shelf
    }
}