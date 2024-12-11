import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface MenuItem {
  url: string;
  text: string;
  icon: string;
}

@Component({
  selector: 'app-menu-bottom',
  templateUrl: './menu-bottom.component.html',
  styleUrl: './menu-bottom.component.scss'
})
export class MenuBottomComponent {

  menuItems: MenuItem[] = [
    {url: '/shelf', text: 'Shelf', icon: 'home.svg'},
    {url: '/grocery', text: 'Grocery', icon: 'grocery-basket.svg'},
    {url: '/recipe', text: 'Recipes', icon: 'recipe-book.svg'},
    {url: '/other', text: 'Other', icon: 'menu-dots.svg'},
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  isRoute(url: string) {
    return this.router.url.includes(url)
  }

  getIconColor(url: string) {
    if (this.isRoute(url))
      return 'var(--primary-color)'
    return 'var(--text-color)'
  }

  goTo(url: string) {
    this.router.navigateByUrl(url);
  }
}
