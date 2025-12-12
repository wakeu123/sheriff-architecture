import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, NgZone, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject, filter, fromEvent, map, merge, Observable, of, take } from "rxjs";

@Injectable({ providedIn: 'root' })
export class OffLineService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly ngZone = inject(NgZone);

  private readonly isOnLine$ = new BehaviorSubject<boolean>(true);
  readonly online$ = this.isOnLine$.asObservable();

  initialize(): void {
    if(!this.isBrowser) return;

    this.isOnLine$.next(navigator.onLine);

    this.ngZone.runOutsideAngular(() => {
      merge(
        fromEvent(window, 'online').pipe(map(() => true)),
        fromEvent(window, 'offline').pipe(map(() => false))
      ).subscribe(online => {
        this.ngZone.run(() => {
          this.isOnLine$.next(online);
        })
      })
    });
  }

  get isOnline(): boolean {
    return this.isOnLine$.getValue();
  }

  waitForOnline$(): Observable<void> {
    if(this.isOnline) return of(void 0);

    return this.online$.pipe(
      filter(online => online),
      take(1),
      map(() => void 0)
    );
  }
}
