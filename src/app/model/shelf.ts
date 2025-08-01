import { Category, ICategory } from './category';
import { IModel } from './imodel';

export interface IShelf {
  id: string;
  name: string;
  shareId: string;
}

export class Shelf implements IModel {
  id: string;
  name: string;
  shareId: string;

  static fromInterface(i: IShelf) {
    const shelf = new Shelf();
    shelf.id = i.id;
    shelf.name = i.name.replace(/\b\w/g, (char) => char.toUpperCase());
    shelf.shareId = i.shareId;
    return shelf;
  }

  static new() {
    return new Shelf();
  }

  deepcopy() {
    const shelf = new Shelf();
    shelf.id = this.id;
    shelf.name = this.name;
    shelf.shareId = this.shareId;
    return shelf;
  }

  toSave() {
    return {
      name: this.name,
    };
  }

  toEdit() {
    return {
      id: this.id,
      name: this.name,
    };
  }

  valid() {
    if (this.name === undefined || this.name.trim() === '') return false;
    return true;
  }
}
