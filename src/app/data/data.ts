import { Category } from '../model/category';
import { Item } from '../model/item';
import { GroceryItem } from '../model/groceryItem';
import { Shelf } from '../model/shelf';
import { ShelfItem } from '../model/shelfItem';
import { DataState } from './dataState';

export class ItemsData extends DataState<Item[]> {
  items: Item[];
  filteredItems: Item[];

  itemName: string = '';
  prevCategories: Category[] = [];
  selectedCategories: Category[] = [];

  override init(items: Item[]) {
    this.items = items;
    this.filteredItems = items;
    this.sortByName();
    this.groupByCategory();
  }

  isEmpty() {
    return this.filteredItems === undefined || this.filteredItems.length === 0;
  }

  update(items: Item[]) {
    const updatedIds = new Set(items.map(item => item.id));
    this.init([
      ...this.items.filter(item => !updatedIds.has(item.id)),
      ...items,
    ]);
  }

  delete(items: Item[]) {
    const idsToDelete = new Set(items.map(item => item.id));
    this.init(this.items.filter(item => !idsToDelete.has(item.id)));
  }

  sortByName() {
    this.filteredItems.sort((a, b) => a.name.localeCompare(b.name));
  }

  groupByCategory() {
    const grouped = {} as { [key: string]: Item[] };

    this.filteredItems.forEach((item) => {
      const key = item.category.id;
      grouped[key] = grouped[key] || [];
      grouped[key].push(item);
    });

    this.filteredItems = Object.values(grouped).flat();
  }

  filter(itemName?: string) {

    this.init(this.items);

    if (this.selectedCategories.length > 0) {
      const ids = this.selectedCategories.map((c) => c.id);
      this.filteredItems = this.filteredItems.filter((item) =>
        ids.includes(item.category.id)
      );
    }

    if (itemName && itemName.trim().length > 0) {
      this.filteredItems = this.filteredItems.filter((item) =>
        item.name
          .toLowerCase()
          .trim()
          .includes(itemName.toLowerCase().trim())
      );
    }
  }

  existByName(itemName: string) {
    return this.getByName(itemName) !== undefined;
  }

  getByName(itemName: string) {
    if (itemName.toLowerCase().trim().length === 0) return undefined;
    let items = this.items.filter(
      (item) => item.name.toLowerCase().trim() === itemName.toLowerCase().trim()
    );
    if (items.length === 0) return undefined;
    return items[0];
  }
}

export class CategoriesData extends DataState<Category[]> {
  categories: Category[];
  filteredCategories: Category[];

  searchText: string = '';

  override init(categories: Category[]) {
    this.categories = categories;
    this.filteredCategories = categories;
    this.sortByName();
  }

  isEmpty() {
    return (
      this.filteredCategories === undefined ||
      this.filteredCategories.length === 0
    );
  }

  update(categories: Category[]) {
    const updatedIds = new Set(categories.map(category => category.id));
    this.init([
      ...this.categories.filter(category => !updatedIds.has(category.id)),
      ...categories,
    ]);
  }

  delete(categories: Category[]) {
    const idsToDelete = new Set(categories.map(category => category.id));
    this.init(this.categories.filter(category => !idsToDelete.has(category.id)));
  }

  sortByName() {
    this.categories.sort((a, b) => a.name.localeCompare(b.name));
  }

  filter() {
    this.init(this.categories);

    if (this.searchText.length > 0) {
      this.filteredCategories = this.filteredCategories.filter((category) =>
        category.name
          .toLowerCase()
          .includes(this.searchText.toLocaleLowerCase())
      );
    }
  }
}

export class ShelfItemsData extends DataState<ShelfItem[]> {
  shelfItems: ShelfItem[];
  filteredShelfItems: ShelfItem[];

  searchText: string = '';
  selectedCategories: Category[] = [];

  override init(shelfItems: ShelfItem[]) {
    this.shelfItems = shelfItems;
    this.filteredShelfItems = shelfItems;
    this.sortByName();
    this.groupByCategory();
  }

  isEmpty() {
    return (
      this.filteredShelfItems === undefined ||
      this.filteredShelfItems.length === 0
    );
  }

  update(shelfItems: ShelfItem[]) {
    const updatedIds = new Set(shelfItems.map(shelfItem => shelfItem.id));
    this.init([
      ...this.shelfItems.filter(shelfItem => !updatedIds.has(shelfItem.id)),
      ...shelfItems,
    ]);
  }

  delete(shelfItems: ShelfItem[]) {
    const idsToDelete = new Set(shelfItems.map(shelfItem => shelfItem.id));
    this.init(this.shelfItems.filter(shelfItem => !idsToDelete.has(shelfItem.id)));
  }

  sortByName() {
    this.filteredShelfItems.sort((a, b) => a.name.localeCompare(b.name));
  }

  groupByCategory() {
    const grouped = {} as { [key: string]: ShelfItem[] };

    this.filteredShelfItems.forEach((item) => {
      const key = item.category.id;
      grouped[key] = grouped[key] || [];
      grouped[key].push(item);
    });

    this.filteredShelfItems = Object.values(grouped).flat();
  }

  filter() {
    this.init(this.shelfItems);

    if (this.selectedCategories.length > 0) {
      const ids = this.selectedCategories.map((c) => c.id);
      this.filteredShelfItems = this.filteredShelfItems.filter((item) =>
        ids.includes(item.category.id)
      );
    }

    if (this.searchText.length > 0) {
      this.filteredShelfItems = this.filteredShelfItems.filter((item) =>
        item.name.toLowerCase().includes(this.searchText.toLocaleLowerCase())
      );
    }
  }
}

export class GroceryItemsData extends DataState<GroceryItem[]> {
  groceryItems: GroceryItem[];
  filteredGroceryItems: GroceryItem[];

  searchText: string = '';
  selectedCategories: Category[] = [];

  override init(groceryItems: GroceryItem[]) {
    this.groceryItems = groceryItems;
    this.filteredGroceryItems = groceryItems;
    this.sortByName();
    this.groupByCategory();
  }

  isEmpty() {
    return (
      this.filteredGroceryItems === undefined ||
      this.filteredGroceryItems.length === 0
    );
  }

  update(groceryItems: GroceryItem[]) {
    const updatedIds = new Set(groceryItems.map(groceryItem => groceryItem.id));
    this.init(
      this.groceryItems
        .filter(groceryItem => !updatedIds.has(groceryItem.id))
        .concat(groceryItems)
    );
  }

  delete(groceryItems: GroceryItem[]) {
    const idsToDelete = new Set(groceryItems.map(groceryItem => groceryItem.id));
    this.init(this.groceryItems.filter(groceryItem => !idsToDelete.has(groceryItem.id)));
  }

  sortByName() {
    this.filteredGroceryItems.sort((a, b) => a.name.localeCompare(b.name));
  }

  groupByCategory() {
    const grouped = {} as { [key: string]: GroceryItem[] };

    this.filteredGroceryItems.forEach((item) => {
      const key = item.category.id;
      grouped[key] = grouped[key] || [];
      grouped[key].push(item);
    });

    this.filteredGroceryItems = Object.values(grouped).flat();
  }

  filter() {
    this.init(this.groceryItems);

    if (this.selectedCategories.length > 0) {
      const ids = this.selectedCategories.map((c) => c.id);
      this.filteredGroceryItems = this.filteredGroceryItems.filter((item) =>
        ids.includes(item.category.id)
      );
    }

    if (this.searchText.length > 0) {
      this.filteredGroceryItems = this.filteredGroceryItems.filter((item) =>
        item.name.toLowerCase().includes(this.searchText.toLocaleLowerCase())
      );
    }
  }
}

export class ShelfData extends DataState<Shelf> {
  shelf?: Shelf;

  override init(shelf: Shelf) {
    this.shelf = shelf;
  }
}
