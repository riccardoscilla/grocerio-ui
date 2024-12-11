import { Component } from '@angular/core';
import { ShelfItem } from '../../model/shelfItem';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';
import { CategoriesData, ItemsData, ShelfItemsData } from '../../data/data';
import { DataStateHandler } from '../../data/dataStateHandler';
import { forkJoin } from 'rxjs';
import { ListItem } from '../../model/listItem';
import { DataService } from '../../services/data.service';
import { Category } from '../../model/category';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html'
})
export class ShelfComponent {
  shelfItemsData: ShelfItemsData = new ShelfItemsData()
  categoriesData: CategoriesData = new CategoriesData()
  itemsData: ItemsData = new ItemsData()
  dataStateHandler: DataStateHandler = new DataStateHandler()

  showShelfItemNew = false
  shelfItemNew: ShelfItem = ShelfItem.new()

  showShelfItemEdit = false
  shelfItemEdit: ShelfItem

  showShelfItemDelete = false
  shelfItemDelete: ShelfItem

  showCategoryFilter = false 

  constructor(
    public dataService: DataService,
    private toastService: ToastService
  ) {
    this.getShelfItems()
    this.getCategories()
    this.getItems()
  }

  getShelfItems() {
    this.dataStateHandler.addAndLoading(this.shelfItemsData)

    this.dataService.getShelfItems().subscribe({
      next: (shelfItems) => {
        this.shelfItemsData.init(shelfItems)
        this.dataStateHandler.setSuccess(this.shelfItemsData)
      },
      error: (error: HttpErrorResponse) => {
        this.dataStateHandler.setError(this.shelfItemsData)
        this.toastService.handleError(error, "Error getShelfItem")
      }
    })
  }

  getCategories() {
    this.dataStateHandler.addAndLoading(this.categoriesData)

    this.dataService.getCategories().subscribe({
      next: (categories) => {
        this.categoriesData.init(categories)
        this.dataStateHandler.setSuccess(this.categoriesData)
      },
      error: (error: HttpErrorResponse) => {
        this.dataStateHandler.setError(this.categoriesData)
        this.toastService.handleError(error, "Error getCategories")
      }
    })
  }

  getItems() {
    this.dataStateHandler.addAndLoading(this.itemsData)

    this.dataService.getItems().subscribe({
      next: (items) => {
        this.itemsData.init(items)
        this.dataStateHandler.setSuccess(this.itemsData)
      },
      error: (error: HttpErrorResponse) => {
        this.dataStateHandler.setError(this.itemsData)
        this.toastService.handleError(error, "Error getItems")
      }
    })
  }

  // FILTERS

  onSearchTextChanged(searchText: string) {
    this.shelfItemsData.searchText = searchText
    this.shelfItemsData.filter()
  }

  // TOGGLE

  toggleShowShelfItemNew() {
    this.shelfItemNew = ShelfItem.new()
    this.showShelfItemNew = !this.showShelfItemNew
  }

  toggleShowShelfItemEdit() {
    this.showShelfItemEdit = !this.showShelfItemEdit
  }

  toggleShowShelfItemDelete() {
    this.showShelfItemDelete = !this.showShelfItemDelete
  }

  toggleShowCategoryFilter() {
    this.showCategoryFilter = !this.showCategoryFilter
  }

  // HANDLE ACTIONS

  onEdit(shelfItem: ShelfItem) {
    this.shelfItemEdit = shelfItem.deepcopy()
    this.toggleShowShelfItemEdit()
  }

  onDelete(shelfItem: ShelfItem) {
    this.shelfItemDelete = shelfItem.deepcopy()
    this.toggleShowShelfItemDelete()
  }  

  onApplyCategoryFilter(categories: Category[]) {
    this.shelfItemsData.selectedCategories = [...categories]
    this.shelfItemsData.filter()
    this.toggleShowCategoryFilter()
  }

  // ACTIONS

  save() {
    this.dataService.saveShelfItem(this.shelfItemNew).subscribe({
      next: () => {
        this.toastService.handleSuccess("Shelf Item saved")
        this.getShelfItems()
        this.toggleShowShelfItemNew()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error save Shelf Item")
      }
    })
  }

  edit() {
    this.dataService.editShelfItem(this.shelfItemEdit).subscribe({
      next: () => {
        this.toastService.handleSuccess("Shelf Item saved")
        this.getShelfItems()
        this.toggleShowShelfItemEdit()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error edit Shelf Item")
      }
    })
  }

  delete() {
    this.dataService.deleteShelfItem(this.shelfItemDelete).subscribe({
      next: () => {
        this.toastService.handleSuccess("Shelf Item deleted")
        this.getShelfItems()
        this.toggleShowShelfItemDelete()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error delete Shelf Item")
      }
    })
  }

  deleteAndInsertInList() {
    const listItem = ListItem.fromShelfItem(this.shelfItemDelete)
    this.dataService.deleteAndSaveInList(this.shelfItemDelete, listItem).subscribe({
      next: () => {
        this.toastService.handleSuccess("Shelf Item deleted and saved in List")
        this.getShelfItems()
        this.toggleShowShelfItemDelete()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error delete Shelf Item and saved in list")
      }
    })
  }
 
}
