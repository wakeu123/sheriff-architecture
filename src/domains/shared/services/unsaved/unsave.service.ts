import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UnsaveService {
  closeComponent(found: boolean): boolean {
    return found ?  confirm('Des modifications non sauvegardées. Quitter ?') : true;
  }
}
