import { Component } from '@angular/core';
import { CategoriesData, ItemsData } from '../../data/data';
import { ToastService } from '../../services/toast.service';
import { DataStateHandler } from '../../data/dataStateHandler';
import { HttpErrorResponse } from '@angular/common/http';
import { Item } from '../../model/item';
import { Category } from '../../model/category';
import { DataService } from '../../services/data.service';
import { catchError, forkJoin, of, tap } from 'rxjs';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html'
})
export class ItemComponent {
  itemsData: ItemsData = new ItemsData()
  categoriesData: CategoriesData = new CategoriesData()
  dataStateHandler: DataStateHandler = new DataStateHandler()

  showItemNew = false
  itemNew: Item = Item.new()

  showItemEdit = false
  itemEdit: Item

  showCategoryFilter = false 

  constructor(
    public dataService: DataService,
    private toastService: ToastService
  ) {
    this.initLoad()
  }

  initLoad() {
    forkJoin({
      categories: this.getCategories(),
      items: this.getItems()
    }).subscribe({
      next: (results) => {
        this.toastService.handleResults(results)
      }
    })
  }

  getCategories() {
     this.dataStateHandler.addAndLoading(this.categoriesData)
 
     return this.dataService.getCategories().pipe(
       tap((categories) => {
         this.categoriesData.init(categories)
         this.dataStateHandler.setSuccess(this.categoriesData)
       }),
       catchError((error: HttpErrorResponse) => {
         this.dataStateHandler.setError(this.categoriesData)
         return of(error)
       })
     )
   }
   
   getItems() {
     this.dataStateHandler.addAndLoading(this.itemsData)
 
     return this.dataService.getItems().pipe(
       tap((items) => {
         this.itemsData.init(items)
         this.dataStateHandler.setSuccess(this.itemsData)
       }),
       catchError((error: HttpErrorResponse) => {
         this.dataStateHandler.setError(this.itemsData)
         return of(error)
       })
     )
   }

  // FILTERS

  onSearchTextChanged(searchText: string) {
    this.itemsData.searchText = searchText
    this.itemsData.filter()
  }

  // TOGGLE

  toggleShowItemNew() {
    this.showItemNew = !this.showItemNew
  }

  toggleShowItemEdit() {
    this.showItemEdit = !this.showItemEdit
  }

  toggleShowCategoryFilter() {
    this.showCategoryFilter = !this.showCategoryFilter
  }
  
  // HANDLE ACTIONS

  onNew() {
    this.itemNew = Item.new()
    this.toggleShowItemNew()
  }

  onEdit(item: Item) {
    this.itemEdit = item.deepcopy()
    this.toggleShowItemEdit()
  }

  onApplyCategoryFilter(categories: Category[]) {
    this.itemsData.selectedCategories = [...categories]
    this.itemsData.filter()
    this.toggleShowCategoryFilter()
  }


  // ACTIONS

  save() {
    this.dataService.saveItem(this.itemNew).subscribe({
      next: () => {
        this.toastService.handleSuccess("Item saved")
        this.getItems().subscribe()
        this.toggleShowItemNew()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error save Item")
      }
    })
  }

  edit() {
    this.dataService.editItem(this.itemEdit).subscribe({
      next: () => {
        this.toastService.handleSuccess("Item saved")
        this.getItems().subscribe()
        this.toggleShowItemEdit()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error edit Item")
      }
    })
  }

  delete(item: Item) {
    this.dataService.deleteItem(item).subscribe({
      next: () => {
        this.toastService.handleSuccess("Item Deleted")
        this.getItems().subscribe()
        this.toggleShowItemEdit()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error deleteItem")
      }
    })
  }

}
