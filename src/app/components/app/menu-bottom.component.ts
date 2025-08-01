import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  url: string;
  text: string;
  icon: string;
  urlColor: string[];
}

@Component({
  selector: 'app-menu-bottom',
  template: `
    <app-fixed>
      <app-row class="menu">
        <div
          #fullflex
          class="item"
          *ngFor="let menuItem of menuItems"
          [class.selected]="isRoute(menuItem)"
          (click)="goTo(menuItem.url)"
        >
          <!-- <ng-component class="select-bar"></ng-component> -->
          <app-svg
            [color]="getIconColor(menuItem)"
            [path]="menuItem.icon"
          ></app-svg>
          <div class="text">{{ menuItem.text }}</div>
        </div>
      </app-row>
    </app-fixed>
  `,
  styles: `
    .menu {
      background: var(--background-color);
      border-top: 2px solid var(--background-border-color);
      border-radius: 16px;
    }

    .item {
      padding: 12px 0 3px 0;

      cursor: pointer;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      gap: 4px;

      position: relative;
    }

    .select-bar {
      position: absolute;
      width: 16px;
      height: 8px;
      top: 0;

      border-radius: 0 0 8px 8px;
      background-color: var(--primary-color);

      visibility: hidden; // do not show by deafult
    }

    .text {
      font-size: 14px;
      font-weight: 500;
    }

    .item.selected {
      .select-bar {
        visibility: visible;
      }

      .text {
        color: var(--primary-color);
      }
    }
  `,
})
export class MenuBottomComponent {
  menuItems: MenuItem[] = [
    { url: '/shelf', text: 'Shelf', icon: 'home.svg', urlColor: [] },
    {
      url: '/grocery',
      text: 'Grocery',
      icon: 'grocery-basket.svg',
      urlColor: [],
    },
    // { url: '/recipe', text: 'Recipes', icon: 'recipe-book.svg', urlColor: [] },
    {
      url: '/more',
      text: 'More',
      icon: 'menu-dots.svg',
      urlColor: ['/items', '/categories', '/share-shelf', '/timer'],
    },
  ];

  constructor(private router: Router) {}

  isRoute(menuItem: MenuItem) {
    return (
      this.router.url.includes(menuItem.url) ||
      menuItem.urlColor.filter((url) => this.router.url.includes(url)).length >
        0
    );
  }

  getIconColor(menuItem: MenuItem) {
    if (this.isRoute(menuItem)) return 'var(--primary-color)';
    return 'var(--background-text-color)';
  }

  goTo(url: string) {
    this.router.navigateByUrl(url);
  }
}
