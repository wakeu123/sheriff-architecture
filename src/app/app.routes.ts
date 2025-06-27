import { Routes } from '@angular/router';
import { hasUnsavedChangesGuard } from '@domains/shared/guards/un-saved-change.guard';

export const routes: Routes = [
  {
    path: 'products/add',
    loadComponent: () => import('../domains/shared/components/empty-router/empty-router.component'),
    canDeactivate: [hasUnsavedChangesGuard]
  }
];
