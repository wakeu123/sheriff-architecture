import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { Product } from "../data/models/product.model";
import { setError, setFulfilled, setPending, withRequestStatus } from "@domains/shared/state";
import { computed, inject } from "@angular/core";
import { ProductService } from "./product.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { withPagination } from "@domains/shared/stores/features/pagination-feature";

export type ProductState = {
  newProduct: Product | null;
  selectedProduct: Product | null;
};

export const ProductStore = signalStore(
  { providedIn: 'root' },

  withRequestStatus(),

  withPagination<Product, ProductService>(ProductService),

  withState<ProductState>({
    newProduct: null,
    selectedProduct: null
  }),

  withComputed(({ newProduct, selectedProduct }) => ({
    hasNewProduct: computed(() => newProduct() !== null),
    isProductSelected: computed(() => selectedProduct() !== null),
  })),

  withMethods((store, _productService = inject(ProductService)) => ({
    setSelectedProduct(product: Product): void {
      patchState(store, { selectedProduct: product });
    },

    clearSelectedProduct(): void {
      patchState(store, { selectedProduct: null });
    },

    addProduct: rxMethod<Partial<Product>>(
      pipe(
        tap(() => patchState(store, setPending())),
        switchMap((productData) => {
          return _productService.post<Product>(productData).pipe(
            tapResponse({
              next: (product) => {
                patchState(store, { newProduct: product }, setFulfilled());
              },
              error: (error: HttpErrorResponse) => patchState(store, setError(error.error.message)),
            })
          )
        }),
      )
    ),
  })),

  withHooks({
    onInit(store) {
      store.loadPage();
    },
  }),

);
