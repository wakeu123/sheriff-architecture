import { toObservable } from "@angular/core/rxjs-interop";
import { computed, inject, Injectable } from "@angular/core";
import { Category } from "@domains/shared/models/category.model";
import { CategoriesListStore } from "../utils/utils-category-store";

@Injectable()
export class CategoryFacade {

  private readonly store = inject(CategoriesListStore);

  category$ = toObservable(this.store.newCategory);

  categories$ = toObservable(this.store.categories);


  categories = computed(() => {
    return this.store.sortedCategories();
  });

  getCategories(): Category[] {
    return this.store.sortedCategories();
  }

  getUnsupportedMethod(id: number): void {
    this.store.getCategoryUnsuppoted(id);
  }

  add(category: Partial<Category>): void {
    this.store.addCategory(category);
  }

  resetNewCategory(): void {
    this.store.resetNewCategory();
  }

  deleteCategory(category: Category): void {
    this.store.deleteCategory(category);
  }
}
