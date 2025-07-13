import { MonoTypeOperatorFunction, Observable, ReplaySubject } from "rxjs";

export function myShareplay<T>(bufferSize: number): MonoTypeOperatorFunction<T>{
  return (source) => {
    const connector = new ReplaySubject<T>(bufferSize);
    const sourceSub = source.subscribe(value => connector.next(value));

    let refCount = 0;

    return new Observable(subscriber => {
      refCount++;
      subscriber.add(() => {
        refCount--;
        if(refCount === 0) sourceSub.unsubscribe();
      });
      connector.subscribe(value => subscriber.next(value))
    });
  }
}
