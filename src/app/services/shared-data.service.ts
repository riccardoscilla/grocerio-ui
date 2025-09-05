import { Injectable } from '@angular/core';
import { CategoriesData, GroceryItemsData, ItemsData, ShelfData, ShelfItemsData } from '../data/data';

@Injectable({ 
  providedIn: 'root' 
})
export class SharedDataService {
  shelfData: ShelfData = new ShelfData();
  categoriesData: CategoriesData = new CategoriesData();
  itemsData: ItemsData = new ItemsData();
  shelfItemsData: ShelfItemsData = new ShelfItemsData();
  groceryItemsData: GroceryItemsData = new GroceryItemsData();
}
