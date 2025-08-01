import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, ICategory } from '../model/category';
import { IItem, Item } from '../model/item';
import { IShelfItem, ShelfItem } from '../model/shelfItem';
import { IGroceryItem, GroceryItem } from '../model/groceryItem';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { IShelf, Shelf } from '../model/shelf';
import { DataState } from '../data/dataState';
import { DataStateHandler } from '../data/dataStateHandler';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private userPath = 'users';
  private shelfPath = 'shelf';
  private categoryPath = 'categories';
  private itemPath = 'items';
  private shelfItemPath = 'shelf-items';
  private groceryItemPath = 'grocery-items';

  constructor(private http: HttpClient) {}

  fetchData<T extends DataState>(
    dataState: T,
    handler: DataStateHandler,
    request: () => Observable<any>
  ): Observable<any> {
    handler.addAndLoading(dataState);

    return request().pipe(
      tap((data) => {
        dataState.init(data);
        handler.setSuccess(dataState);
      }),
      catchError((error: HttpErrorResponse) => {
        handler.setError(dataState);
        return of(error);
      })
    );
  }

  // USER

  joinShelf(shareId: string) {
    return this.http.post<void>(
      `${this.apiUrl}/${this.userPath}/join-shelf`,
      shareId
    );
  }

  // SHELF

  saveShelf(data: object): Observable<Shelf> {
    return this.http
      .post<IShelf>(`${this.apiUrl}/${this.shelfPath}`, data)
      .pipe(map((shelf) => Shelf.fromInterface(shelf)));
  }

  getShelf(): Observable<Shelf> {
    return this.http
      .get<IShelf>(`${this.apiUrl}/${this.shelfPath}`)
      .pipe(map((shelf) => Shelf.fromInterface(shelf)));
  }

  // CATEGORIES

  getCategories(): Observable<Category[]> {
    return this.http
      .get<ICategory[]>(`${this.apiUrl}/${this.categoryPath}`)
      .pipe(map((categories) => categories.map(Category.fromInterface)));
  }

  saveCategory(data: object): Observable<Category> {
    return this.http
      .post<ICategory>(`${this.apiUrl}/${this.categoryPath}`, data)
      .pipe(map((i) => Category.fromInterface(i)));
  }

  editCategory(id: string, data: object): Observable<Category> {
    return this.http
      .put<ICategory>(`${this.apiUrl}/${this.categoryPath}/${id}`, data)
      .pipe(map((i) => Category.fromInterface(i)));
  }

  deleteCategory(id: string): Observable<Category> {
    return this.http
      .delete<ICategory>(`${this.apiUrl}/${this.categoryPath}/${id}`)
      .pipe(map((i) => Category.fromInterface(i)));
  }

  // ITEMS

  getItems(): Observable<Item[]> {
    return this.http
      .get<IItem[]>(`${this.apiUrl}/${this.itemPath}`)
      .pipe(map((items) => items.map(Item.fromInterface)));
  }

  saveItem(data: object): Observable<Item> {
    return this.http
      .post<IItem>(`${this.apiUrl}/${this.itemPath}`, data)
      .pipe(map((i) => Item.fromInterface(i)));
  }

  editItem(id: string, data: object): Observable<Item> {
    return this.http
      .put<IItem>(`${this.apiUrl}/${this.itemPath}/${id}`, data)
      .pipe(map((i) => Item.fromInterface(i)));
  }

  deleteItem(id: string): Observable<Item> {
    return this.http
      .delete<IItem>(`${this.apiUrl}/${this.itemPath}/${id}`)
      .pipe(map((i) => Item.fromInterface(i)));
  }

  // SHELF ITEMS

  getShelfItems(): Observable<ShelfItem[]> {
    return this.http
      .get<IShelfItem[]>(`${this.apiUrl}/${this.shelfItemPath}`)
      .pipe(map((shelfItems) => shelfItems.map(ShelfItem.fromInterface)));
  }

  saveShelfItems(data: object[]): Observable<ShelfItem[]> {
    return this.http
      .post<IShelfItem[]>(`${this.apiUrl}/${this.shelfItemPath}/many`, data)
      .pipe(map((shelfItems) => shelfItems.map(ShelfItem.fromInterface)));
  }

  editShelfItem(id: string, data: object): Observable<ShelfItem> {
    return this.http
      .put<IShelfItem>(`${this.apiUrl}/${this.shelfItemPath}/${id}`, data)
      .pipe(map((i) => ShelfItem.fromInterface(i)));
  }

  deleteShelfItem(id: string): Observable<ShelfItem> {
    return this.http
      .delete<IShelfItem>(`${this.apiUrl}/${this.shelfItemPath}/${id}`)
      .pipe(map((i) => ShelfItem.fromInterface(i)));
  }

  deleteAndSaveInList(id: string): Observable<ShelfItem> {
    return this.http
      .delete<IShelfItem>(`${this.apiUrl}/${this.shelfItemPath}/${id}/move-in-grocery`)
      .pipe(map((i) => ShelfItem.fromInterface(i)));
  }

  // LIST ITEMS

  getGroceryItems(): Observable<GroceryItem[]> {
    return this.http
      .get<IGroceryItem[]>(`${this.apiUrl}/${this.groceryItemPath}`)
      .pipe(map((groceryItems) => groceryItems.map(GroceryItem.fromInterface)));
  }

  saveGroceryItems(data: object[]): Observable<GroceryItem[]> {
    return this.http
      .post<IGroceryItem[]>(`${this.apiUrl}/${this.groceryItemPath}/many`, data)
      .pipe(map((groceryItems) => groceryItems.map(GroceryItem.fromInterface)));
  }

  editGroceryItem(id: string, data: object): Observable<GroceryItem> {
    return this.http
      .put<IGroceryItem>(`${this.apiUrl}/${this.groceryItemPath}/${id}`, data)
      .pipe(map((i) => GroceryItem.fromInterface(i)));
  }

  deleteGroceryItem(id: string): Observable<GroceryItem> {
    return this.http
      .delete<IGroceryItem>(`${this.apiUrl}/${this.groceryItemPath}/${id}`)
      .pipe(map((i) => GroceryItem.fromInterface(i)));
  }

  deleteAndSaveInShelf(id: string): Observable<GroceryItem> {
    return this.http
      .delete<IGroceryItem>(`${this.apiUrl}/${this.groceryItemPath}/${id}/move-in-shelf`)
      .pipe(map((i) => GroceryItem.fromInterface(i)));
  }

  endGrocery(): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/${this.groceryItemPath}/move-cart-in-shelf`, {});
  }
}
