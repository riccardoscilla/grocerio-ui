import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-loading',
  template: `
    <div style="padding: 16px">
      <div style="display: flex; flex-direction: column; gap: 8px">
        <p-skeleton height="60px" />
        <p-skeleton height="60px" />
        <p-skeleton height="60px" />
      </div>
    </div>
  `,
  styles: [``],
})
export class ListLoadingComponent {}
