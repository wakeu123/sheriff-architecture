import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { Order, ProductRequest, ProductResponse } from "../models/product.model";
import { computed, inject, InjectionToken } from "@angular/core";
import { ProductService } from "../services/product.service";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, pipe, switchMap, tap, throwError } from "rxjs";
import { tapResponse } from '@ngrx/operators';
import { HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";

type ProductState = {
  isLoading: boolean;
  products: ProductResponse[];
  newProduct: Nullable<ProductResponse>;
  filter: { query: string, order: Order };
  selectedProduct: Nullable<ProductResponse>;
}

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

    sortedProducts: computed(() => {[]
      const direction = filter().order === 'ASC' ? 1 : -1;

      return products().sort((a, b) =>
      direction * a.name.localeCompare(b.name));
    }),
  })),

  withMethods((store, productService = inject(ProductService), messageService = inject(MessageService)) => ({

    updateQuery(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }))
    },

    updateSelectedProduct(product: ProductResponse): void {
      patchState(store, { selectedProduct: product })
    },

    updateOrder(order: Order): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }))
    },

    add(product: ProductResponse): void {
      patchState(store, (state) => ({ products: [...state.products, product ] }))
    },

    loadProducts: rxMethod(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => productService.search<ProductResponse>()),
        tapResponse({
          next: (products: ProductResponse[]) => {
            patchState(store, { isLoading: false, products });
            console.log('Store products: ', store.products());
          },
          error: (error) => {
            console.error(error);
            patchState(store, { isLoading: false });
          }
        })
      ),
    ),


    addProduct: rxMethod<ProductRequest>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap((product) => {
          return productService.post<ProductResponse>(product).pipe(
            tapResponse({
              next: (response: ProductResponse) => {

                patchState(store, (state) => (
                  { 
                    isLoading: false,
                    newProduct: response, 
                    products: [...state.products, response], 
                  }))
                  console.log('Store: ', store.products());
                  console.log('Store new product: ', store.newProduct());
                  console.log('Store products length 2: ', store.productsCount());
              },
              error: (error) => {
                console.log(error);
                patchState(store, { isLoading: false });
              }
            })
          );
        })
      )
    ),

    deleteProduct: rxMethod<ProductResponse>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap((product) => {
          return productService.delete<void>(new HttpParams().set('uniqueCode', product.uniqueCode.toString())).pipe(
            tapResponse({
              next: () => {
                messageService.add({ severity: 'success', summary: 'Succès', detail: `${product.name} supprimé avec succès.` });
                console.log('Store products length 3: ', store.productsCount());
              },
              error: (error) => {
                console.error('Error deleting product:', error);
                messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression du produit.' });
              }
            }),
            switchMap(() => {
              return productService.search<ProductResponse>().pipe(
                tap((products: ProductResponse[]) => {
                  patchState(store, { products, isLoading: false });
                  console.log('Store products after deletion: ', store.products());
                  console.log('Store products count after deletion: ', store.productsCount());
                }),
              )
            }),
            catchError((error) => {
              console.error('Error fetching products after deletion:', error);
              patchState(store, { isLoading: false });
              return throwError(() => error);
            })
          );
        })
      )
    )
  }))
);
