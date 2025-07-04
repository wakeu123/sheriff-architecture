import { inject, Injectable } from "@angular/core";
import { ConfirmationService } from "primeng/api";

@Injectable({ providedIn: 'root' })
export class ConfirmService {

  private readonly service = inject(ConfirmationService);

  showConfirmDelete(message: string, icon?: string, title?: string): boolean {
    const found = false;
    this.service.confirm({
      message: message,
      header: title ?? '',
      key: 'confirm_delete',
      closable: title ? true : false,
      icon: icon ? icon : 'pi pi-exclamation-triangle',
    });
    return found;
  }
}
