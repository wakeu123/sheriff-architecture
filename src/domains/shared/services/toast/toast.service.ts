import { inject, Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({ providedIn: 'root' })
export class ToastService {

  private readonly service = inject(MessageService);
  //private readonly translate = inject(TranslateService);

  showSuccess(message: string, title?: string): void {
    this.service.add({
      life: 3000,
      detail: message,
      severity: 'success',
      summary: title ?? 'Succes'
    });
  }

  showError(message: string, title?: string): void {
    this.service.add({
      life: 3000,
      detail: message,
      severity: 'error',
      summary: title ?? 'Error'
    });
  }

}
