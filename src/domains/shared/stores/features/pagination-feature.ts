import { HttpErrorResponse } from "@angular/common/http";
import { computed, inject, Injector, Type } from "@angular/core";
import { hideLoading, PaginatedResponse, showLoading, withLoading } from "@domains/shared/state"
import { tapResponse } from "@ngrx/operators";
import { patchState, signalStoreFeature, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { MessageService } from "primeng/api";
import { catchError, Observable, of, pipe, switchMap, tap } from "rxjs"

export type PaginationParams = {
  page?: number;
  size?: number;
  sort?: string;
  filters?: Record<string, unknown>;
}

export type PaginationState<T> = {
  items: T[];
  pageSize: number;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  error: string | null;
  filters: Record<string, unknown>;
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export type ApiService<T> = {
  getAllWithPagination(params: PaginationParams): Observable<PaginatedResponse<T>>;
}

export const API_SERVICE_TOKEN = Symbol('API_SERVICE_TOKEN');


export function withPagination<T, Service extends ApiService<T> = ApiService<T>>(
  serviceToken: Type<Service> | string = API_SERVICE_TOKEN
) {
  return signalStoreFeature(
    withState<PaginationState<T>>({
      items: [],
      error: null,
      filters: {},
      pageSize: 20,
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      sort: {
        field: '',
        direction: 'asc'
      },
    }),

    withLoading(),

    withMethods((store, injector = inject(Injector), _messageService = inject(MessageService)) => {
      // Injection dynamique du service
      const apiService = injector.get<Service>(
        typeof serviceToken === 'string' ? serviceToken : serviceToken
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
          tap(() => patchState(store, showLoading(), { error: null })),
          switchMap((params) => {
            const actualParams = params || {
              page: store.currentPage(),
              size: store.pageSize(),
              filters: store.filters ?? {},
              sort: `${store.sort()?.field},${store.sort()?.direction}`
            };

            return apiService.getAllWithPagination(actualParams).pipe(
              tapResponse({
                next: (response: PaginatedResponse<T>) => {
                  patchState(store, {
                    items: response.items,
                    totalItems: response.total,
                    currentPage: response.page,
                    totalPages: response.size
                  }, hideLoading());
                },
                error: (error: HttpErrorResponse) => {
                  console.log(error);
                  patchState(store, { error: error.error.message }, hideLoading());
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
            patchState(store, { error: error.error.message }, hideLoading());
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
