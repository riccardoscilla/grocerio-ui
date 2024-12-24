import { Component } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { ToastService } from '../../services/toast.service'
import { CategoriesData, ItemsData, ListItemsData } from '../../data/data'
import { DataStateHandler } from '../../data/dataStateHandler'
import { catchError, forkJoin, of, tap } from 'rxjs'
import { ListItem } from '../../model/listItem'
import { DataService } from '../../services/data.service'
import { Category } from '../../model/category'

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
    this.initLoad()
  }

  initLoad() {
    forkJoin({
      listItems: this.getListItems(),
      categories: this.getCategories(),
      items: this.getItems()
    }).subscribe({
      next: (results) => {
        this.toastService.handleResults(results)
      }
    })
  }

  getListItems() {
    this.dataStateHandler.addAndLoading(this.listItemsData)
    
    return this.dataService.getListItems().pipe(
      tap((listItems) => {
        this.listItemsData.init(listItems)
        this.dataStateHandler.setSuccess(this.listItemsData)
      }),
      catchError((error: HttpErrorResponse) => {
        this.dataStateHandler.setError(this.listItemsData)
        return of(error)
      })
    )
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
    this.dataService.deleteAndSaveInShelf(this.checkedListItems).subscribe({
      next: () => {
        this.toastService.handleSuccess("List items moved in shelf!")
        this.getListItems().subscribe()
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
        this.getListItems().subscribe()
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
        this.getListItems().subscribe()
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
        this.getListItems().subscribe()
        this.toggleShowListItemDelete()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error delete List Item")
      }
    })
  }
 
}
