import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../model/category';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-category-new',
  template: `
    <app-bottom-sheet
      [visible]="visible"
      header="Edit Grocery Item"
      (closed)="onClosed.emit()"
    >
      <app-container content>
        <app-row label="Name">
          <input #fullflex type="text" pInputText [(ngModel)]="name" />
        </app-row>

        <app-row label="Icon">
          <input #fullflex type="text" pInputText [(ngModel)]="icon" />
        </app-row>
      </app-container>

      <app-row footer>
        <app-button #fullflex label="Save" (onClick)="save()" [disabled]="disabledSave()" />
      </app-row>
    </app-bottom-sheet>
  `,
  styles: [],
})
export class CategoryNewComponent implements OnInit {
  @Input() category: Category;

  @Output() onClosed = new EventEmitter<void>();

  visible = false;

  // form
  name: string;
  icon: string;

  constructor(
    public sharedDataService: SharedDataService,
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.name = this.category.name;
    this.visible = true;
  }

  save() {
    const data = {
      name: this.name,
      icon: this.icon,
    };

    this.apiService.saveCategory(data).subscribe({
      next: (category: Category) => {
        this.toastService.handleSuccess('Category saved');
        this.sharedDataService.categoriesData.update([category]);
        this.onClosed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.handleError(error, 'Error save Category');
      },
    });
  }

  disabledSave() {
    if (this.name === undefined || this.name.trim() === '') return true;
    if (this.icon === undefined || this.name.trim() === '') return true;
    return false;
  }
}
