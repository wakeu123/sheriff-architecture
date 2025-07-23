import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductComponent } from '@domains/products/ui/product.component';
import { ProductService } from '@domains/products/data/services/product.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Product } from '@domains/products/data/models/product.model';
import { Router, RouterOutlet } from '@angular/router';
import { ToastService } from '@domains/shared/services/toast/toast.service';
import { ConfirmService } from '@domains/shared/services/confirm/confirm.service';
import { SafeStack } from '@domains/shared/utils/safe-stack';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ButtonModule, ToastModule, RouterOutlet],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  providers: [ProductService, DialogService],
})
export class ProductListComponent {

  private readonly router = inject(Router);
  private readonly confirm = inject(ConfirmService);
  private readonly toastService = inject(ToastService);
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);

  stacks = new SafeStack<DynamicDialogRef>();

  ref: DynamicDialogRef | undefined;

  showConfirm(): void {
    this.confirm.showConfirmDelete('Je suis la notification', '','Supprimer un produit');
  }

  showNotification(): void {
    this.toastService.showSuccess('Je suis la notification', 'Notification');
  }

  onShowModal(): void {
    this.ref = this.dialogService.open(ProductComponent, {
        header: 'Ajouter un étudiant',
        width: '60vw',
        modal:true,
        data: {
          name: 'Mr. Wakeu Georges Favier'
        },
        // appendTo: "body",
        closable: true,
        baseZIndex: 10000,
        breakpoints: {
            '960px': '75vw',
            '640px': '90vw'
        },
    });

    setTimeout(() => {
      this.stacks.closeAllRefs();
      console.log('All modal references closed');
    }, 3000);

    this.stacks.push(this.ref);
    console.log('Stack size:', this.stacks.size());
    console.log('Stack elements:', this.stacks.peek());

    this.router.navigate(['products', 'add']);

    this.ref.onClose.subscribe((product: Product) => {
      if(product) {
        this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product.utilisateurCreation });
      }
      console.log('Modal closed...');
      console.log('Stack cleared');
      console.log('Stack size:', this.stacks.size());
      console.log('Stack elements:', this.stacks.peek());
      this.router.navigate(['']);
    });
  }

}
