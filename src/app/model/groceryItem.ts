import { ReturnStatement } from '@angular/compiler';
import { Category } from './category';
import { IItem, Item } from './item';
import { IModel } from './imodel';
import { ShelfItem } from './shelfItem';

export interface IGroceryItem {
  id: string;
  quantity: number;
  insertionDate: string;
  note?: string;
  inCart: boolean;

  item: IItem;
}

export class GroceryItem implements IModel {
  id: string;
  quantity: number;
  insertionDate: Date;
  note?: string;
  inCart: boolean;

  item: Item;

  static fromInterface(i: IGroceryItem) {
    const groceryItem = new GroceryItem();
    groceryItem.id = i.id;
    groceryItem.quantity = i.quantity;
    groceryItem.insertionDate = new Date(i.insertionDate);
    groceryItem.note = i.note;
    groceryItem.inCart = i.inCart;

    groceryItem.item = Item.fromInterface(i.item);

    return groceryItem;
  }

  static new() {
    const groceryItem = new GroceryItem();
    groceryItem.quantity = 1;
    groceryItem.insertionDate = new Date();
    groceryItem.item = Item.new();
    groceryItem.inCart = false;
    return groceryItem;
  }

  deepcopy() {
    const groceryItem = new GroceryItem();
    groceryItem.id = this.id;
    groceryItem.note = this.note;
    groceryItem.quantity = this.quantity;
    groceryItem.insertionDate = this.insertionDate;
    groceryItem.inCart = this.inCart;

    groceryItem.item = this.item.deepcopy();
    return groceryItem;
  }

  valid() {
    if (this.quantity < 1) return false;
    if (this.insertionDate === null) return false;
    if (this.item !== undefined && !this.item.valid()) return false;
    return true;
  }

  get name(): string {
    return this.item.name;
  }

  get category(): Category {
    return this.item.category;
  }

  set category(category: Category) {
    this.item.category = category;
  }

  get icon(): string {
    return this.item.category.icon;
  }

  plusQuantity() {
    this.quantity += 1;
  }

  minusQuantity() {
    this.quantity = Math.max(0, (this.quantity -= 1));
  }
}
