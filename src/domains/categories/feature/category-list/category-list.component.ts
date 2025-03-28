import {Component} from '@angular/core';
import { CategoryComponent } from '@domains/categories/ui/category.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CategoryComponent
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
  providers: []
})
export class CategoryListComponent { }
