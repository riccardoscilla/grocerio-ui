import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

interface MenuItem {
  url: string
  text: string
  icon: string
  urlColor: string[]
}

@Component({
  selector: 'app-menu-bottom',
  templateUrl: './menu-bottom.component.html',
  styleUrl: './menu-bottom.component.scss'
})
export class MenuBottomComponent {

  menuItems: MenuItem[] = [
    {url: '/shelf', text: 'Shelf', icon: 'home.svg', urlColor: []},
    {url: '/grocery', text: 'Grocery', icon: 'grocery-basket.svg', urlColor: []},
    {url: '/recipe', text: 'Recipes', icon: 'recipe-book.svg', urlColor: []},
    {url: '/more', text: 'More', icon: 'menu-dots.svg', urlColor: ['/items', '/categories', '/share-shelf']},
  ]

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  isRoute(menuItem: MenuItem) {
    return this.router.url.includes(menuItem.url) 
      || menuItem.urlColor.filter(url => this.router.url.includes(url)).length > 0
  }

  getIconColor(menuItem: MenuItem) {
    if (this.isRoute(menuItem))
      return 'var(--primary-color)'
    return 'var(--text-color)'
  }

  goTo(url: string) {
    this.router.navigateByUrl(url)
  }
}
