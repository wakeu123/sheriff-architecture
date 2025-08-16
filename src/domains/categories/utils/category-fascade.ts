import { inject, Injectable } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { Category } from "@domains/shared/models/category.model";
import { SaveType } from "@domains/shared/models/save-type.mode";
import { CategoriesListStore } from "../utils/utils-category-store";

@Injectable()
export class CategoryFacade {

  private readonly store = inject(CategoriesListStore);


  saveType = this.store.saveType();
  categories$= toObservable(this.store.categories);
  category$ = toObservable(this.store.newCategory);

  init(): void {
    this.store.loadCategories();
  }

  add(saveType: SaveType, category: Partial<Category>): void {
    this.store.addCategory({saveType, category});
  }

  deleteCategory(category: Category): void {
    this.store.deleteCategory(category);
  }
}
