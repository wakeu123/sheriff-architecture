import { Component } from '@angular/core';
import { ProductComponent } from '@domains/products/ui/product.component';
import { ProductService } from '@domains/products/data/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ProductComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  providers: [ProductService]
})
export class ProductListComponent {}
