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
    <app-title [title]="'Categories'" [back]="'/more'"></app-title>

    <app-container [padding]="'16px'" *ngIf="dataStateHandler.isSuccess()">
      <app-list>
        <app-list-item
          *ngFor="let category of categoriesData.filteredCategories"
          [icon]="category.icon"
          [contentText]="category.name"
          (edit)="onEdit(category)"
        >
        </app-list-item>
      </app-list>

      <app-row *ngIf="categoriesData.isEmpty()">No Categories</app-row>
    </app-container>

    <app-list-loading *ngIf="dataStateHandler.isLoading()"></app-list-loading>

    <app-fixed-bottom-right>
      <app-new-button (toggleShowNew)="onNew()"></app-new-button>
    </app-fixed-bottom-right>

    <app-menu-bottom></app-menu-bottom>

    <app-category-new
      *ngIf="showCategoryNew"
      [(visible)]="showCategoryNew"
      [category]="categoryNew"
      (onSaved)="savedCategory($event)"
    ></app-category-new>

    <app-category-edit
      *ngIf="showCategoryEdit"
      [(visible)]="showCategoryEdit"
      [category]="categoryEdit"
      (onEdited)="editedCategory($event)"
    ></app-category-edit>
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
