import { Injectable } from "@angular/core";
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from "rxjs";

export interface GeneralArrayState<T> {
  items: T[],
  currentItem: T | null,
  selectedIndex: number,
}

@Injectable()
export class GeneralArrayStore<T> extends ComponentStore<GeneralArrayState<T>> {

  constructor(){
    super({
      items: [],
      currentItem: null,
      selectedIndex: 0,
    });
  }

  // Selecteurs en observable

  items$: Observable<T[]> = this.select((state) => state.items);
  currentItem$: Observable<T | null> = this.select((state) => state.currentItem);
  selectedIndex$: Observable<number> = this.select((state) => state.selectedIndex);

  /* Fin selecteurs observable */

  // Selecteurs en signal

  items  = this.selectSignal((state) => state.items);
  currentItem = this.selectSignal((state) => state.currentItem);
  selectedIndex = this.selectSignal((state) => state.selectedIndex);

  /* Fin selecteurs signal */

  setItems(items: T[]): void {
    this.patchState(() => ({
      items,
    }));
  }

  addItem(item: T): void {
    this.patchState((state) => ({
      items: [...state.items, item],
    }))
  }

  updateItem(item: T): void {
    this.patchState((state) => ({
      items: state.items.map((elem, index) => index === state.selectedIndex ? item : elem),
    }))
  }

  removeItem(item: T): void {
    this.patchState((state) => ({
      items: state.items.filter(e => e !== item)
    }));
  }

  selectItem(item: T): void {
    this.patchState((state) => ({
      ...state,
      currentItem: item,
      selectedIndex: state.items.findIndex(e => e === item)
    }))
  }
}
