export interface ICategory {
    id: string
    icon: string
    name: string
}

export class Category {
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
}