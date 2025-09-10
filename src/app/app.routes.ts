import { Routes } from '@angular/router';
import { hasUnsavedChangesGuard } from '@domains/shared/guards/un-saved-change.guard';
//import { hasUnsavedChangesGuard } from '@domains/shared/guards/un-saved-change.guard';

export const routes: Routes = [
  {
    path: 'products/add',
    loadComponent: () => import('../domains/shared/components/empty-router/empty-router.component'),
    canDeactivate: [hasUnsavedChangesGuard]
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('../domains/categories/feature/category-list/category-list.component')
        .then((c) => c.CategoryListComponent)
  },
  {
    path: 'categories/edit/:unique-code',
    loadComponent: () => import('../domains/categories/ui/category.component').then((c) => c.CategoryComponent)
  },
  {
    path: 'products',
    loadComponent: () =>
      import('../domains/products/feature/product-list/product-list.component')
        .then((c) => c.ProductListComponent)
  },
];
