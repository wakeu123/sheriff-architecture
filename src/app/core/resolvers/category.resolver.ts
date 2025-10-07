import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { CategoriesListStore } from "@domains/categories/utils/utils-category-store";
import { Category } from "@domains/shared/models/category.model";

export const categoryResolve: ResolveFn<Category> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(CategoriesListStore);
  return store.categories()[0];
}
