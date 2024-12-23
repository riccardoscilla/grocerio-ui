import { Category, ICategory } from "./category";
import { IModel } from "./imodel";

export interface IItem {
    id: string
    name: string
    category: ICategory
}

export class Item implements IModel {
    id: string
    name: string
    category: Category

    static fromInterface(i: IItem) {
        const item = new Item()
        item.id = i.id
        item.name = i.name.replace(/\b\w/g, (char) => char.toUpperCase());
        item.category = Category.fromInterface(i.category)
        return item
    }

    static new() {
        return new Item()
    }

    deepcopy() {
        const item = new Item()
        item.id = this.id
        item.name = this.name
        item.category = this.category.deepcopy()
        return item
    } 

    toSave() {
        return {
            "name": this.name,
            "categoryId": this.category.id
        }
    }

    toEdit() {
        return {
            "id": this.id,
            "name": this.name,
            "categoryId": this.category.id
        }
    }

    valid() {
        if (this.name === undefined || this.name.trim() === "")
            return false
        if (this.category === undefined || this.category.id === undefined)
            return false
        return true
    }
}
