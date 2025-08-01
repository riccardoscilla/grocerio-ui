import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../model/category';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category-new',
  template: `
    <app-bottom-sheet
      [header]="'Edit Grocery Item'"
      [visible]="visible"
      (visibleChange)="visibleChange.emit($event)"
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
        <p-button
          #fullflex
          label="Save"
          [disabled]="disabledSave()"
          (click)="save()"
        />
      </app-row>
    </app-bottom-sheet>
  `,
  styles: [],
})
export class CategoryNewComponent implements OnInit {
  @Input() category: Category;
  @Input() visible: boolean;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSaved = new EventEmitter<Category>();

  // form
  name: string;
  icon: string;

  constructor(
    public apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.name = this.category.name;
  }

  save() {
    const data = {
      name: this.name,
      icon: this.icon,
    };

    this.apiService.saveCategory(data).subscribe({
      next: (category: Category) => {
        this.toastService.handleSuccess('Category saved');
        this.visibleChange.emit(false);
        this.onSaved.emit(category);
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
