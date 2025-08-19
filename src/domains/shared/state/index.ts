import { computed, inject } from '@angular/core';
import { patchState, signalStoreFeature, withComputed, withMethods, withState } from '@ngrx/signals'
import { CategoryService } from '@domains/categories/utils/utils-category.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { HttpErrorResponse } from '@angular/common/http';


// Request Status SignalStoreFeature

export type RequestStatus =
  | 'idle'
  | 'pending'
  | 'fulfilled'
  | { error: string };

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RequestStatusState = { requestStatus: RequestStatus };

export function withRequestStatus() {

  return signalStoreFeature(

    withState<RequestStatusState>({ requestStatus: 'idle' }),

    withComputed(({ requestStatus }) => ({

      isPending: computed(() => requestStatus() === 'pending'),

      isFulfiled: computed(() => requestStatus() === 'fulfilled'),

      error: computed(() => {

        const status = requestStatus();

        return typeof status === 'object' ? status.error : null;

      })
    }))
  );
}

export function setPending(): RequestStatusState {
  return { requestStatus: 'pending' };
}

export function setFulfilled(): RequestStatusState {
  return { requestStatus: 'fulfilled' };
}

export function setError(error: string): RequestStatusState {
  return { requestStatus: { error } };
}


// Loader SignalStoreFeature

export type LoaderState = {
  isLoading: boolean;
};

export function withLoading() {
  return signalStoreFeature(
    withState<LoaderState>({ isLoading: false })
  );
}

export function showLoading(): LoaderState {
  return { isLoading: true };
}

export function hideLoading(): LoaderState {
  return { isLoading: false };
}



