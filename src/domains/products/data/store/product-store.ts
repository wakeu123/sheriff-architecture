import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { Order, ProductRequest, ProductResponse } from "../models/product.model";
import { computed, inject, InjectionToken } from "@angular/core";
import { ProductService } from "../services/product.service";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from "rxjs";
import { tapResponse } from '@ngrx/operators';

type ProductState = {
  isLoading: boolean;
  products: ProductResponse[];
  newProduct: Nullable<ProductResponse>;
  filter: { query: string, order: Order };
  selectedProduct: Nullable<ProductResponse>;
};

const initialState: ProductState = {
  products: [],
  isLoading: false,
  newProduct: null,
  selectedProduct: null,
  filter: { query: '', order: 'ASC' }
};

const PRODUCT_STATE = new InjectionToken<ProductState>(
  'ProductState',
  { factory: () => initialState }
);

export const ProductStore = signalStore(

  withState(() => inject(PRODUCT_STATE)),

  withComputed(({ products, filter }) => ({

    productsCount: computed(() => products().length),

    sortedProducts: computed(() => {
      const direction = filter().order === 'ASC' ? 1 : -1;

      return products().sort((a, b) =>
      direction * a.name.localeCompare(b.name));
    }),
  })),

  withMethods((store, productService = inject(ProductService)) => ({

    updateQuery(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }))
    },

    updateOrder(order: Order): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }))
    },

    add(product: ProductResponse): void {
      patchState(store, (state) => ({ products: [...state.products, product ] }))
    },

    addProduct: rxMethod<ProductRequest>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap((product) => {
          return productService.post<ProductResponse>(product).pipe(
            tapResponse({
              next: (response: ProductResponse) => 
                patchState(store, (state) => (
                  { 
                    isLoading: false,
                    newProduct: response, 
                    products: [...state.products, response], 
                  })),
              error: (error) => {
                console.log(error);
                patchState(store, { isLoading: false });
              }
            })
          );
        })
      )
    ),
  }))
);
