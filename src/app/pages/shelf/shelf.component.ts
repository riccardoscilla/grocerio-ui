import { Component, HostListener } from '@angular/core'
import { ShelfItem } from '../../model/shelfItem'
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http'
import { ToastService } from '../../services/toast.service'
import { CategoriesData, ItemsData, ShelfData, ShelfItemsData } from '../../data/data'
import { DataStateHandler } from '../../data/dataStateHandler'
import { catchError, forkJoin, of, tap } from 'rxjs'
import { ListItem } from '../../model/listItem'
import { DataService } from '../../services/data.service'
import { Category } from '../../model/category'

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html'
})
export class ShelfComponent {
  shelfItemsData: ShelfItemsData = new ShelfItemsData()
  categoriesData: CategoriesData = new CategoriesData()
  itemsData: ItemsData = new ItemsData()
  shelfData: ShelfData = new ShelfData()
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
    this.initLoad()
  }

  initLoad() {
    forkJoin({
      shelfItems: this.getShelfItems(),
      categories: this.getCategories(),
      items: this.getItems(),
      shelf: this.getShelf()
    }).subscribe({
      next: (results) => {
        this.toastService.handleResults(results)
      }
    })
  }

  getShelf() {
    this.dataStateHandler.addAndLoading(this.shelfData)

    return this.dataService.getShelf().pipe(
      tap((shelf) => {
        this.shelfData.init(shelf)
        this.dataStateHandler.setSuccess(this.shelfData)
      }),
      catchError((error: HttpErrorResponse) => {
        this.dataStateHandler.setError(this.shelfData)
        return of(error)
      })
    )
  }

  getShelfItems() {
    this.dataStateHandler.addAndLoading(this.shelfItemsData)
    
    return this.dataService.getShelfItems().pipe(
      tap((shelfItems) => {
        this.shelfItemsData.init(shelfItems)
        this.dataStateHandler.setSuccess(this.shelfItemsData)
      }),
      catchError((error: HttpErrorResponse) => {
        this.dataStateHandler.setError(this.shelfItemsData)
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
        this.getShelfItems().subscribe()
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
        this.getShelfItems().subscribe()
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
        this.getShelfItems().subscribe()
        this.toggleShowShelfItemDelete()
        this.toggleShowShelfItemEdit()
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
        this.getShelfItems().subscribe()
        this.toggleShowShelfItemDelete()
        this.toggleShowShelfItemEdit()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error delete Shelf Item and saved in list")
      }
    })
  }
 
}
