import { Component } from '@angular/core';
import { CategoriesData } from '../../data/data';
import { ToastService } from '../../services/toast.service';
import { DataStateHandler } from '../../data/dataStateHandler';
import { Category } from '../../model/category';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-category',
  template: `
    <app-scaffold (onRefresh)="initLoad()">
      <app-title appbar [title]="'Categories'" [back]="'/more'"></app-title>

      <app-container content [padding]="'16px'" *ngIf="dataStateHandler.isSuccess()">
        <app-list>
          <app-list-tile *ngFor="let category of categoriesData.filteredCategories" (onClick)="onEdit(category)">
            <app-category-icon leading [icon]="category.icon"/>
            <div content>{{category.name}}</div>
          </app-list-tile>
        </app-list>

        <app-row *ngIf="categoriesData.isEmpty()">No Categories</app-row>
      </app-container>

      <app-list-loading content *ngIf="dataStateHandler.isLoading()"></app-list-loading>

      <app-new-button fab (toggleShowNew)="onNew()"></app-new-button>

      <app-menu-bottom bottomtabbar />
    </app-scaffold>

    <app-category-new
      *ngIf="showCategoryNew"
      [category]="categoryNew"
      (onClosed)="showCategoryNew = false"
      (onSaved)="savedCategory($event)"
    />

    <app-category-edit
      *ngIf="showCategoryEdit"
      [category]="categoryEdit"
      (onClosed)="showCategoryEdit = false"
      (onEdited)="editedCategory($event)"
    />
    `,
})
export class CategoryComponent {
  categoriesData: CategoriesData = new CategoriesData();
  dataStateHandler: DataStateHandler = new DataStateHandler();

  showCategoryNew = false;
  categoryNew: Category;

  showCategoryEdit = false;
  categoryEdit: Category;

  constructor(
    public apiService: ApiService,
    private toastService: ToastService
  ) {
    this.initLoad();
  }

  initLoad() {
    forkJoin({
      categories: this.getCategories(),
    }).subscribe({
      next: (results) => {
        this.toastService.handleResults(results);
      },
    });
  }

  getCategories() {
    return this.apiService.fetchData(
      this.categoriesData,
      this.dataStateHandler,
      () => this.apiService.getCategories()
    );
  }

  // HANDLES

  onNew() {
    this.categoryNew = Category.new();
    this.showCategoryNew = true;
  }

  onEdit(category: Category) {
    this.categoryEdit = category.deepcopy();
    this.showCategoryEdit = true;
  }

  // ACTIONS

  editedCategory(category: Category) {
    this.categoriesData.update([category]);
  }

  savedCategory(category: Category) {
    this.categoriesData.update([category]);
  }

  deletedCategory(category: Category) {
    this.categoriesData.delete([category]);
  }
}
