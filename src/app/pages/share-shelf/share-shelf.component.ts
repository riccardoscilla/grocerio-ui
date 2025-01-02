import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-share-shelf',
  templateUrl: './share-shelf.component.html'
})
export class ShareShelfComponent {

  shareId: String
  joinShareId: String

  constructor(
    private dataService: DataService,
    private toastService: ToastService,    
    private authService: AuthService,
    private router: Router
  ) {}

  getShareId() {
    this.dataService.getShareId().subscribe({
      next: (shelf) => {
        this.shareId = shelf.shareId
        this.copyToClipboard()
      },
      error: (error) => {
        this.toastService.handleError(error, "Error get share id")
      }
    })
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.shareId as string)
    .then(() => this.toastService.handleSuccess("Share Id copied!"))
  }
 
  joinShelf() {
    this.dataService.joinShelf(this.joinShareId).subscribe({
      next: () => {
        this.toastService.handleSuccess("Shelf changed!")
        this.router.navigateByUrl(`/shelf`)
      },
      error: (error) => {
        this.toastService.handleError(error, "Error join shelf")
      }
    })
  }
}
