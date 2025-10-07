// eslint-disable-next-line @softarc/sheriff/dependency-rule
import { patchState, signalStoreFeature, withMethods, withState } from "@ngrx/signals";
import { hideLoading, showLoading, withLoading } from "@domains/shared/state";
import { IPost } from "@domains/shared/services/base/i-post.interface";
import { inject, InjectionToken, Type } from "@angular/core";
import { BaseEntity } from "../models/base-entity.model";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { tapResponse } from "@ngrx/operators";
import { exhaustMap } from "rxjs";

type CreatedType<T> = T | null;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type CreateState = { newItem: CreatedType<unknown> };

export function withCreateOperationFeature<P extends BaseEntity>(
  createService: Type<IPost> | InjectionToken<IPost>,
) {
  return signalStoreFeature(
    withState<CreateState>({ newItem: null }),
    withLoading(),
    withMethods((store) => {
      const service = inject(createService);

      return {
        addItem: rxMethod<unknown>(
          exhaustMap((model) => {
            patchState(store, showLoading());
            return service.post<P>(model).pipe(
              tapResponse({
                next: (addedItem) => {
                  patchState(store, {
                    newItem: (addedItem as P)
                  });
                },
                error: console.error,
                finalize: () => patchState(store, hideLoading()),
              }),
            );
          }),
        ),
      };
    })
  );
}

export function resetAddedItem(): CreateState {
  return { newItem: null };
}
