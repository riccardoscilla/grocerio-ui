import { Category, ICategory } from './category';
import { IModel } from './imodel';

export interface IItem {
  id: string;
  name: string;
  category: ICategory;
  favourite: boolean;
}

export class Item implements IModel {
  id: string;
  name: string;
  category: Category;
  favourite: boolean = false;
  checked: boolean = false;

  static fromInterface(i: IItem) {
    const item = new Item();
    item.id = i.id;
    item.name = i.name.replace(/\b\w/g, (char) => char.toUpperCase());
    item.category = Category.fromInterface(i.category);
    item.favourite = i.favourite;
    return item;
  }

  static new() {
    const item = new Item();
    item.category = Category.new();
    return item;
  }

  get icon(): string {
    return this.category.icon;
  }

  deepcopy() {
    const item = new Item();
    item.id = this.id;
    item.name = this.name;
    item.category = this.category.deepcopy();
    item.favourite = this.favourite;
    return item;
  }

  valid() {
    if (this.name === undefined || this.name.trim() === '') return false;
    if (this.category !== undefined && !this.category.valid()) return false;
    return true;
  }
}
