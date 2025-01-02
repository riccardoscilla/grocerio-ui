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
  selector: 'app-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent {
  categoriesData: CategoriesData = new CategoriesData()
  dataStateHandler: DataStateHandler = new DataStateHandler()

  showCategoryNew = false
  categoryNew: Category = Category.new()

  showCategoryEdit = false
  categoryEdit: Category

  constructor(
    public dataService: DataService,
    private toastService: ToastService
  ) {
    this.initLoad()
  }

  initLoad() {
    forkJoin({
      categories: this.getCategories()
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

  // FILTERS

  onSearchTextChanged(searchText: string) {
    this.categoriesData.searchText = searchText
    this.categoriesData.filter()
  }

  // TOGGLE

  toggleShowCategoryNew() {
    this.showCategoryNew = !this.showCategoryNew
  }

  toggleShowCategoryEdit() {
    this.showCategoryEdit = !this.showCategoryEdit
  }

  // HANDLE ACTIONS

  onNew() {
    this.categoryNew = Category.new()
    this.toggleShowCategoryNew()
  }

  onEdit(category: Category) {
    this.categoryEdit = category.deepcopy()
    this.toggleShowCategoryEdit()
  }

  // ACTIONS

  save() {
    this.dataService.saveCategory(this.categoryNew).subscribe({
      next: () => {
        this.toastService.handleSuccess("Category saved")
        this.getCategories().subscribe()
        this.toggleShowCategoryNew()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error save Category")
      }
    })
  }

  edit() {
    this.dataService.editCategory(this.categoryEdit).subscribe({
      next: () => {
        this.toastService.handleSuccess("Category saved")
        this.getCategories().subscribe()
        this.toggleShowCategoryEdit()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error edit Category")
      }
    })
  }

  delete(category: Category) {
    this.dataService.deleteCategory(category).subscribe({
      next: () => {
        this.toastService.handleSuccess("Category Deleted")
        this.getCategories().subscribe()
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, "Error delete Category")
      }
    })
  }

}
