import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { Product } from "../data/models/product.model";
import { setPending, showLoading, withLoading, withPagination, withRequestStatus } from "@domains/shared/state";
import { computed, inject } from "@angular/core";
import { ProductService } from "./product.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe } from "gsap";
import { tap } from "rxjs";

export type ProductState = {
  selectedProduct: Product | null;
};

export const ProductStore = signalStore(
  { providedIn: 'root' },

  withLoading(),

  withRequestStatus(),

  withPagination<Product>(),

  withState<ProductState>({
    selectedProduct: null
  }),

  withComputed(({ selectedProduct }) => ({
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
        tap(() => {
          patchState(store, showLoading(), setPending());
        })
      )
    ),
  })),

);
