import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';
import { CategoriesData, ItemsData, ListItemsData } from '../../data/data';
import { DataStateHandler } from '../../data/dataStateHandler';
import { forkJoin } from 'rxjs';
import { ListItem } from '../../model/listItem';
import { DataService } from '../../services/data.service';
import { ShelfItem } from '../../model/shelfItem';
import { Category } from '../../model/category';

@Component({
  selector: 'app-grocery',
  templateUrl: './grocery.component.html'
})
export class GroceryComponent {
  listItemsData: ListItemsData = new ListItemsData()
  categoriesData: CategoriesData = new CategoriesData()
  itemsData: ItemsData = new ItemsData()
  dataStateHandler: DataStateHandler = new DataStateHandler()

  showListItemNew = false
  listItemNew: ListItem = ListItem.new()

  showListItemEdit = false
  listItemEdit: ListItem

  showListItemDelete = false
  listItemDelete: ListItem

  showCategoryFilter = false 

  checkedListItems: ListItem[] = []

  constructor(
    public dataService: DataService,
    private toastService: ToastService
  ) {
    this.getListItems()
    this.getCategories()
    this.getItems()
  }

  getListItems() {
    this.dataStateHandler.addAndLoading(this.listItemsData)

    this.dataService.getListItems().subscribe({
      next: (listItems) => {
        this.listItemsData.init(listItems)
        this.dataStateHandler.setSuccess(this.listItemsData)
      },
      error: (error: HttpErrorResponse) => {
        this.dataStateHandler.setError(this.listItemsData)
        this.toastService.handleError(error, "Error getListItem")
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
    this.listItemsData.searchText = searchText
    this.listItemsData.filter()
  }

  // TOGGLE

  toggleShowListItemNew() {
    this.listItemNew = ListItem.new()
    this.showListItemNew = !this.showListItemNew
  }

  toggleShowListItemEdit() {
    this.showListItemEdit = !this.showListItemEdit
  }

  toggleShowListItemDelete() {
    this.showListItemDelete = !this.showListItemDelete
  }

  toggleShowCategoryFilter() {
    this.showCategoryFilter = !this.showCategoryFilter
  }

  // HANDLE ACTIONS

  onEdit(listItem: ListItem) {
    this.listItemEdit = listItem.deepcopy()
    this.toggleShowListItemEdit()
  }

  onDelete(listItem: ListItem) {
    this.listItemDelete = listItem.deepcopy()
    this.toggleShowListItemDelete()
  }  

  onApplyCategoryFilter(categories: Category[]) {
    this.listItemsData.selectedCategories = [...categories]
    this.listItemsData.filter()
    this.toggleShowCategoryFilter()
  }

  onCheck(listItem: ListItem) {
    this.checkedListItems.push(listItem)
  }

  onUncheck(listItem: ListItem) {
    this.checkedListItems = this.checkedListItems.filter(item => item.id !== listItem.id) 
  }

  onFinish() {
    console.log(this.checkedListItems)

    this.dataService.deleteAndSaveInShelf(this.checkedListItems).subscribe({
      next: () => {
        this.toastService.handleSuccess("List items moved in shelf!")
        this.getListItems()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error moving List items in shelf")
      }
    })
  }

  // ACTIONS

  save() {
    this.dataService.saveListItem(this.listItemNew).subscribe({
      next: () => {
        this.toastService.handleSuccess("List Item saved")
        this.getListItems()
        this.toggleShowListItemNew()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error save List Item")
      }
    })
  }

  edit() {
    this.dataService.editListItem(this.listItemEdit).subscribe({
      next: () => {
        this.toastService.handleSuccess("List Item saved")
        this.getListItems()
        this.toggleShowListItemEdit()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error edit List Item")
      }
    })
  }

  delete() {
    this.dataService.deleteListItem(this.listItemDelete).subscribe({
      next: () => {
        this.toastService.handleSuccess("List Item deleted")
        this.getListItems()
        this.toggleShowListItemDelete()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error delete List Item")
      }
    })
  }
 
}
