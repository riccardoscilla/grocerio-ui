import { Category } from '../model/category';
import { Item } from '../model/item';
import { GroceryItem } from '../model/groceryItem';
import { Shelf } from '../model/shelf';
import { ShelfItem } from '../model/shelfItem';
import { DataUtils } from './dataUtils';
import { DataArray } from './dataArray';
import { DataSingle } from './dataSingle';

export class ItemsData extends DataArray<Item> {

  init(data: Item[]) {
    this.data.set(data);
  }

  filter(searchName: string = "") {
    let items = DataUtils.create(this.getData())
      .sort('name')
      .groupAndFlatten('category.id')
      .search('name', searchName)
      .get();

      console.log("filter")
    return items;
  };
  
  existByName(itemName: string) {
    return this.existBy('name', itemName);
  }

  getByName(itemName: string) {
    return this.getBy('name', itemName);
  }
}

export class CategoriesData extends DataArray<Category> {

  init(data: Category[]) {
    this.data.set(data);
  }

  filter()  {
    const items = DataUtils.create(this.getData())
      .sort('name')
      .groupAndFlatten('id')
      .get();

    return items;
  };
}

export class ShelfItemsData extends DataArray<ShelfItem> {

  init(data: ShelfItem[]) {
    this.data.set(data);
  }

  filter() {
    const items = DataUtils.create(this.getData())
      .sort('item.name')
      .groupAndFlatten('item.category.id')
      .get();

    return items;
  };
}

export class GroceryItemsData extends DataArray<GroceryItem> {

  init(data: GroceryItem[]) {
    this.data.set(data);
  }

  filter() {
    console.log("csa")
    const items = DataUtils.create(this.getData())
      .sort('item.name')
      .groupAndFlatten('item.category.id')
      .get();

    return items;
  };
}

export class ShelfData extends DataSingle<Shelf> {

  init(data: Shelf) {
    this.data.set(data);
  }
}
