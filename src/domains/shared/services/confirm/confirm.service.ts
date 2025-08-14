import { inject, Injectable, signal } from "@angular/core";
import { ConfirmationService } from "primeng/api";

@Injectable({ providedIn: 'root' })
export class ConfirmService {

  private readonly service = inject(ConfirmationService);

  showConfirmDelete(message: string, acceptFn: () => void, rejectFn: () => void, icon?: string, title?: string): void {
    this.service.confirm({
      message: message,
      header: title ?? '',
      key: 'confirm_delete',
      closable: title ? true : false,
      icon: icon ? icon : 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Confirmed deletion');
        acceptFn();
      },
      reject: () => {
        console.log('Deletion rejected');
      }
    });
  }
}
