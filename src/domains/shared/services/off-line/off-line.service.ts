import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, NgZone, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject, fromEvent, map, merge } from "rxjs";

@Injectable({ providedIn: 'root' })
export class OffLineService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly ngZone = inject(NgZone);

  private readonly isOnLine$ = new BehaviorSubject<boolean>(true);
  readonly online$ = this.isOnLine$.asObservable();

  initialize(): void {
    console.log('is browser', this.isBrowser);
    if(!this.isBrowser) return;

    this.isOnLine$.next(navigator.onLine);

    this.ngZone.runOutsideAngular(() => {
      merge(
        fromEvent(window, 'online').pipe(map(() => true)),
        fromEvent(window, 'offline').pipe(map(() => false))
      ).subscribe(online => {
        this.ngZone.run(() => {
          this.isOnLine$.next(online);
          console.log(online ? '🌐 En ligne' : '📴 Hors ligne');
        })
      })
    });
  }

  get isOnline(): boolean {
    return this.isOnLine$.getValue();
  }

  async waitForOnline(): Promise<void> {
    if(this.isOnline) return;

    return new Promise<void>(resolve => {
      const subscription = this.online$.subscribe(online => {
        if(online) {
          subscription.unsubscribe();
          resolve();
        }
      });
    });
  }
}
