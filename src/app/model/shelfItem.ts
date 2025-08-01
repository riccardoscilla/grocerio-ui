import { Category } from './category';
import { IItem, Item } from './item';
import { IModel } from './imodel';

export interface IShelfItem {
  id: string;
  quantity: number;
  purchaseDate: string;
  note?: string;

  item: IItem;
}

export class ShelfItem implements IModel {
  id: string;
  quantity: number;
  purchaseDate: Date;
  note?: string;

  item: Item;

  static fromInterface(i: IShelfItem) {
    const shelfItem = new ShelfItem();
    shelfItem.id = i.id;
    shelfItem.quantity = i.quantity;
    shelfItem.purchaseDate = new Date(i.purchaseDate);
    shelfItem.note = i.note;

    shelfItem.item = Item.fromInterface(i.item);

    return shelfItem;
  }

  static new() {
    const shelfItem = new ShelfItem();
    shelfItem.quantity = 1;
    shelfItem.purchaseDate = new Date();
    shelfItem.item = Item.new();
    return shelfItem;
  }

  deepcopy() {
    const shelfItem = new ShelfItem();
    shelfItem.id = this.id;
    shelfItem.note = this.note;
    shelfItem.quantity = this.quantity;
    shelfItem.purchaseDate = this.purchaseDate;

    shelfItem.item = this.item.deepcopy();
    return shelfItem;
  }

  valid() {
    if (this.quantity < 1) return false;
    if (this.purchaseDate === null) return false;
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
