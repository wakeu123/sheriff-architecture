import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { catchError, exhaustMap, pipe, switchMap, tap, throwError } from 'rxjs';
import { computed, inject, InjectionToken } from "@angular/core";
import { Category } from "@domains/shared/models/category.model";
import { OrderType } from "@domains/shared/models/order-type";
import { CategoryService } from "./utils-category.service";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { HttpParams } from '@angular/common/http';
import { tapResponse } from '@ngrx/operators';
import { MessageService } from "primeng/api";

type CategoryState = {
  isLoading: boolean;
  categories: Category[];
  newCategory: Category | null;
  selectedCategory: Nullable<Category>;
  filter: { query: string, order: OrderType };
}

const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  newCategory: null,
  selectedCategory: null,
  filter: { query: '', order: 'ASC' }
};

const CATEGORY_STATE = new InjectionToken<CategoryState>(
  'CategoryState',
  { factory: () => initialState }
);

export const CategoriesListStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(CATEGORY_STATE)),

  withComputed(({ categories, filter }) => ({

    categoriesCount: computed(() => categories().length),

    sortedCategories: computed(() => {
      const direction = filter().order === 'ASC' ? 1 : -1;

      return categories().sort((a, b) =>
      direction * a.name.localeCompare(b.name));
    }),
  })),

  withMethods((store, categoryService = inject(CategoryService), messageService = inject(MessageService)) => ({

    updateQuery(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }))
    },

    updateSelectedCategory(category: Category): void {
      patchState(store, { selectedCategory: category })
    },

    resetNewCategory(): void {
      patchState(store, { newCategory: null })
    },

    updateOrder(order: OrderType): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }))
    },

    add(category: Category): void {
      patchState(store, (state) => ({ categories: [...state.categories, category ] }))
    },

    loadCategories: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => categoryService.search<Category>()),
        tapResponse({
          next: (categories: Category[]) => {
            patchState(store, { isLoading: false, categories });
          },
          error: (error) => {
            console.error(error);
            patchState(store, { isLoading: false });
          }
        })
      ),
    ),

    addCategory: rxMethod<Partial<Category>>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap((category) => {
          return categoryService.post<Category>(category).pipe(
            tapResponse({
              next: (response) => {
                patchState(store, { newCategory: response });
                messageService.add({ severity: 'success', summary: 'Succès', detail: `${category.name} ajoute avec succès.` });
              },
              error: (error) => {
                console.error('Error added category:', error);
                messageService.add({ severity: 'error', summary: 'Erreur', detail: `Échec de l'ajout de la categorie ${category.name}` });
              }
            }),
            switchMap(() => {
              return categoryService.search<Category>().pipe(
                tap((categories: Category[]) => {
                  patchState(store, { categories, isLoading: false });
                }),
              )
            }),
            catchError((error) => {
              console.error('Error fetching categories after addition:', error);
              patchState(store, { isLoading: false });
              return throwError(() => error);
            })
          );
        })
      )
    ),

    getCategory: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((uniqueCode) => {
          return categoryService.getByuniqueCode(uniqueCode).pipe(
            tapResponse({
              next: (response) => {
                patchState(store, { isLoading: false, selectedCategory: response });
              },
              error: (error) => {
                console.log(error)
                patchState(store, { isLoading: false })
              }
            })
          )
        })
      )
    ),

    deleteCategory: rxMethod<Category>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap((category) => {
          return categoryService.delete<void>(new HttpParams().set('uniqueCode', category.uniqueCode.toString())).pipe(
            tapResponse({
              next: () => {
                messageService.add({ severity: 'success', summary: 'Succès', detail: `${category.name} supprimé avec succès.` });
              },
              error: (error) => {
                console.error('Error deleting category:', error);
                messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression du produit.' });
              }
            }),
            switchMap(() => {
              return categoryService.search<Category>().pipe(
                tap((categories: Category[]) => {
                  patchState(store, { categories, isLoading: false });
                }),
              )
            }),
            catchError((error) => {
              console.error('Error fetching categories after deletion:', error);
              patchState(store, { isLoading: false });
              return throwError(() => error);
            })
          );
        })
      )
    )
  }))
);
