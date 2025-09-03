import { HttpErrorResponse } from "@angular/common/http";
import { computed, inject, Injector, Type } from "@angular/core";
import { PaginationResponse } from "@domains/shared/models/pagination-response.model";
import { hideLoading, setError, showLoading, withLoading, withRequestStatus } from "@domains/shared/state"
import { tapResponse } from "@ngrx/operators";
import { patchState, signalStoreFeature, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { MessageService } from "primeng/api";
import { catchError, Observable, of, pipe, switchMap, tap } from "rxjs"

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  filters?: Record<string, unknown>;
}

export interface PaginationState<T> {
  items: T[];
  pageSize: number;
  totalItems: number;
  currentPage: number;
  pageSizes: number[];
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  filters: Record<string, unknown>;
}

export interface ApiService<T> {
  getAllWithPagination(params: PaginationParams): Observable<PaginationResponse<T>>;
}

import { InjectionToken } from "@angular/core";
//export const API_SERVICE_TOKEN = Symbol('API_SERVICE_TOKEN');
export const API_SERVICE_TOKEN = new InjectionToken<ApiService<unknown>>('API_SERVICE_TOKEN');


export function withPagination<T, Service extends ApiService<T> = ApiService<T>>(
  serviceToken: Type<Service> | InjectionToken<Service> | string = API_SERVICE_TOKEN
) {
  return signalStoreFeature(
    withState<PaginationState<T>>({
      items: [],
      filters: {},
      pageSize: 20,
      totalItems: 0,
      currentPage: 1,
      sort: {
        field: '',
        direction: 'asc'
      },
      pageSizes: [20, 50, 100, 500, 1000]
    }),

    withLoading(),

    withRequestStatus(),

    withMethods((store) => {
      const injector = inject(Injector);
      const _messageService = inject(MessageService);

      const apiService = injector.get<Service>(
        serviceToken as Type<Service> | InjectionToken<Service>
      );

      const totalPages = computed(() =>
        Math.ceil(store.totalItems() / store.pageSize())
      );

      const hasNextPage = computed(() =>
        store.currentPage() < totalPages()
      );

      const hasPreviousPage = computed(() =>
        store.currentPage() > 1
      );

      const loadPage = rxMethod<PaginationParams | void>(
        pipe(
          tap(() => patchState(store, showLoading())),
          switchMap((params) => {
            const actualParams = params || ({
              page: store.currentPage(),
              size: store.pageSize(),
              filters: store.filters ?? {},
              sort: `${store.sort()?.field},${store.sort()?.direction}`
            } as unknown as PaginationParams);

            return apiService.getAllWithPagination(actualParams).pipe(
              tapResponse({
                next: (response: PaginationResponse<T>) => {
                  patchState(store, {
                    items: response.items,
                    totalItems: response.total,
                    currentPage: response.page,
                    pageSize: response.pageSize,
                  }, hideLoading());
                },
                error: (error: HttpErrorResponse) => {
                  console.log(error);
                  patchState(store, setError(error.error.message), hideLoading());
                  if(error.status === 503) {
                    _messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de joindre le serveur.' });
                  } else if(error.status === 500) {
                    _messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Internal server error' });
                  }
                }
              })
            );
          }),
          catchError((error: HttpErrorResponse) => {
            console.log(error);
            patchState(store, setError(error.error.message), hideLoading());
            if(error.status === 503) {
              _messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de joindre le serveur.' });
            } else if(error.status === 500) {
              _messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Internal server error' });
            }
            return of(null);
          })
        )
      );

      return {
        totalPages,
        hasNextPage,
        hasPreviousPage,

        loadPage: (params?: PaginationParams) => loadPage(params),

        nextPage: () => {
          if(hasNextPage()) {
            loadPage({ page: store.currentPage() + 1 });
          }
        },

        previousPage: () => {
          if(hasPreviousPage()) {
            loadPage({ page: store.currentPage() - 1 });
          }
        },

        goToPage: (page: number): void => {
          if(page >= 1 && page <= totalPages()) {
            loadPage({ page });
          }
        },

        setPage(page: number): void {
          patchState(store, { currentPage: page });
          loadPage({ page });
        },

        setPageSize(pageSize: number): void {
          patchState(store, { currentPage: 1, pageSize });
          loadPage({ page: 1, size: pageSize });
        },

        setSortBy(field: string, direction: 'asc' | 'desc'): void {
          patchState(store, { sort: { field, direction } });
          loadPage({ sort: `${field},${direction}` });
        },

        updateFilters(filters: Record<string, unknown>): void {
          patchState(store, { filters });
          loadPage({ filters });
        },

        refresh: () => {
          loadPage();
        },
      };

    }),
  );
}
