import { Routes } from '@angular/router';
import { CategoriesListStore } from '@domains/categories/utils/utils-category-store';
//import { hasUnsavedChangesGuard } from '@domains/shared/guards/un-saved-change.guard';

export const routes: Routes = [
  {
    path: 'products/add',
    loadComponent: () => import('../domains/shared/components/empty-router/empty-router.component'),
    //canDeactivate: [hasUnsavedChangesGuard]
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('../domains/categories/feature/category-list/category-list.component')
        .then((c) => c.CategoryListComponent),
    providers: [CategoriesListStore]
  },
  {
    path: 'categories/edit/:unique-code',
    loadComponent: () => import('../domains/categories/ui/category.component').then((c) => c.CategoryComponent)
  }
];
