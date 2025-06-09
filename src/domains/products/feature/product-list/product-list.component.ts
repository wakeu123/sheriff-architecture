import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductComponent } from '@domains/products/ui/product.component';
import { ProductService } from '@domains/products/data/services/product.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Product } from '@domains/products/data/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ButtonModule, ToastModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  providers: [ProductService, DialogService],
})
export class ProductListComponent {

  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);

  ref: DynamicDialogRef | undefined;

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

    this.ref.onClose.subscribe((product: Product) => {
      if(product) {
        this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product.utilisateurCreation });
      }
    });
  }

}
