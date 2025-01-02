import { IModel } from "./imodel"

export interface ICategory {
    id: string
    icon: string
    name: string
}

export class Category implements IModel {
    id: string
    icon: string
    name: string

    static fromInterface(i: ICategory) {
        const category = new Category()
        category.id = i.id
        category.icon = i.icon
        category.name = i.name.replace(/\b\w/g, (char) => char.toUpperCase());
        return category
    }

    static new() {
        return new Category()
    }

    deepcopy() {
        const category = new Category()
        category.id = this.id
        category.icon = this.icon
        category.name = this.name
        return category
    } 

    valid() {
        if (this.name === undefined || this.name.trim() === "")
            return false
        if (this.icon === undefined || this.icon.trim() === "")
            return false
        return true
    }

    toSave() {
        return {
            "name": this.name,
            "icon": this.icon
        }
    }

    toEdit() {
        return {
            "id": this.id,
            "name": this.name,
            "icon": this.icon
        }
    }
}