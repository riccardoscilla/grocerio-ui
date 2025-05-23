import { ReturnStatement } from "@angular/compiler";
import { Category } from "./category";
import { IItem, Item } from "./item";
import { IModel } from "./imodel";
import { ShelfItem } from "./shelfItem";

export interface IListItem {
    id: string;
    quantity: number;
    insertionDate: string;
    note?: string;
    inCart: boolean;

    item: IItem
}

export class ListItem implements IModel {
    id: string;
    quantity: number;
    insertionDate: Date;
    note?: string;
    inCart: boolean;

    item: Item

    static fromInterface(i: IListItem) {
        const listItem = new ListItem()
        listItem.id = i.id
        listItem.quantity = i.quantity
        listItem.insertionDate = new Date(i.insertionDate)
        listItem.note = i.note
        listItem.inCart = i.inCart

        listItem.item = Item.fromInterface(i.item)

        return listItem
    }

    static new() {
        const listItem = new ListItem()
        listItem.quantity = 1
        listItem.insertionDate = new Date()
        listItem.item = Item.new()
        listItem.inCart = false;
        return listItem
    }

    deepcopy() {
        const listItem = new ListItem()
        listItem.id = this.id
        listItem.note = this.note 
        listItem.quantity = this.quantity
        listItem.insertionDate = this.insertionDate
        listItem.inCart = this.inCart

        listItem.item = this.item.deepcopy()
        return listItem
    } 

    valid() {
        if (this.quantity < 1)
            return false
        if (this.insertionDate === null)
            return false 
        if (this.item !== undefined && !this.item.valid())
            return false
        return true
    }

    get name(): string {
        return this.item.name
    }

    get category(): Category {
        return this.item.category
    }

    set category(category: Category) {
        this.item.category = category
    }

    get icon(): string {
        return this.item.category.icon
    }

    toSave() {
        return {
            "itemNew": this.item.toSave(),
            "quantity": this.quantity,
            "insertionDate": this.insertionDate,
            "note": this.note,
            "inCart": this.inCart
        }
    }

    toEdit() {
        return {
            "id": this.id,
            "itemNew": this.item.toSave(),
            "quantity": this.quantity,
            "insertionDate": this.insertionDate,
            "note": this.note,
            "inCart": this.inCart
        }
    }

    plusQuantity() {
        this.quantity += 1
    }

    minusQuantity() {
        this.quantity = Math.max(0, this.quantity -= 1)
    }
}