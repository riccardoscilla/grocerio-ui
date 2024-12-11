import { Component } from '@angular/core';
import { CategoriesData, ItemsData } from '../../data/data';
import { ToastService } from '../../services/toast.service';
import { DataStateHandler } from '../../data/dataStateHandler';
import { HttpErrorResponse } from '@angular/common/http';
import { Item } from '../../model/item';
import { Category } from '../../model/category';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html'
})
export class ItemsComponent {
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
    this.getItems()
    this.getCategories()
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
        this.getItems()
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
        this.getItems()
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
        this.getItems()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error deleteItem")
      }
    })
  }

}
