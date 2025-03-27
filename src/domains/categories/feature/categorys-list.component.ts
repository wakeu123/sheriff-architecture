import {Component} from '@angular/core';
import {CategoryComponent} from '@domains/categories/feature/internal/category.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CategoryComponent
  ],
  template: `<p>Component categories list</p>
  <app-category/>
  `
})
export class CategorysListComponent { }
