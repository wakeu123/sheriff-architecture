import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductComponent } from '@domains/products/ui/product.component';
import { ProductService } from '@domains/products/data/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  providers: [ProductService, DialogService],
})
export class ProductListComponent {

  private readonly dialogService = inject(DialogService);

  ref: DynamicDialogRef | undefined;

  onShowModal(): void {
    console.log('');
    this.ref = this.dialogService.open(ProductComponent, {
            header: 'Select a Product',
            width: '60vw',
            modal:true,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
        });
  }

}
