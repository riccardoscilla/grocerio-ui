import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, ICategory } from '../model/category';
import { IItem, Item } from '../model/item';
import { IShelfItem, ShelfItem } from '../model/shelfItem';
import { IListItem, ListItem } from '../model/listItem';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = environment.apiUrl;
  private categoryPath = 'categories'
  private itemPath = "items"
  private shelfItemPath = "shelf-items"
  private listItemPath = "list-items"

  constructor(private http: HttpClient) { }

  // CATEGORIES

  getCategories(): Observable<Category[]> {
    return this.http.get<ICategory[]>(`${this.apiUrl}/${this.categoryPath}`).pipe(
      map(categories => categories.map(Category.fromInterface))
    )
  }

  // ITEMS

  getItems(): Observable<Item[]> {
    return this.http.get<IItem[]>(`${this.apiUrl}/${this.itemPath}`).pipe(
      map(items => items.map(Item.fromInterface))
    )
  }

  saveItem(item: Item): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${this.itemPath}`, item.toSave())
  }

  editItem(item: Item): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${this.itemPath}/${item.id}`, item.toEdit())
  }

  deleteItem(item: Item): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.itemPath}/${item.id}`)
  }

  // SHELF ITEMS

  getShelfItems(): Observable<ShelfItem[]> {
    return this.http.get<IShelfItem[]>(`${this.apiUrl}/${this.shelfItemPath}`).pipe(
      map(shelfItems => shelfItems.map(ShelfItem.fromInterface))
    )
  }

  saveShelfItem(shelfItem: ShelfItem): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${this.shelfItemPath}`, shelfItem.toSave());
  }

  editShelfItem(shelfItem: ShelfItem): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${this.shelfItemPath}/${shelfItem.id}`, shelfItem.toEdit())
  }

  deleteShelfItem(shelfItem: ShelfItem): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.shelfItemPath}/${shelfItem.id}`)
  }

  deleteAndSaveInList(shelfItem: ShelfItem, listItem: ListItem): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${this.shelfItemPath}/${shelfItem.id}/deleteAndSaveInList`, listItem.toSave())
  }

  // LIST ITEMS

  getListItems(): Observable<ListItem[]> {
    return this.http.get<IListItem[]>(`${this.apiUrl}/${this.listItemPath}`).pipe(
      map(listItems => listItems.map(ListItem.fromInterface))
    )
  }

  saveListItem(listItem: ListItem): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${this.listItemPath}`, listItem.toSave());
  }

  editListItem(listItem: ListItem): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${this.listItemPath}/${listItem.id}`, listItem.toEdit())
  }

  deleteListItem(listItem: ListItem): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.listItemPath}/${listItem.id}`)
  }

  deleteAndSaveInShelf(listItems: ListItem[]): Observable<void> {
    const combined = {
      "listItemIds": listItems.map(i => i.id),
      "shelfItems": listItems.map(i => ShelfItem.fromListItem(i).toSave())
    }
    return this.http.post<void>(`${this.apiUrl}/${this.listItemPath}/deleteAndSaveInShelf`, combined)
  }

}
