import { Order, Product, ProductRequest, ProductResponse } from './../../data/models/product.model';
import { ConfirmService } from '@domains/shared/services/confirm/confirm.service';
import { ProductService } from '@domains/products/data/services/product.service';
import { ToastService } from '@domains/shared/services/toast/toast.service';
import { ProductComponent } from '@domains/products/ui/product.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SafeStack } from '@domains/shared/utils/safe-stack';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NavigationExtras, Router, RouterOutlet } from '@angular/router';
import { Observable, Subject, tap, zip } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { ProductStore } from '@domains/products/data/store/product-store';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

export type Durum = ['flat bread', 'meat', 'sauce', 'tomato', 'cabbage'];


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ NgIf, AsyncPipe, JsonPipe, ButtonModule, ToastModule, RouterOutlet],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  providers: [ProductService, DialogService, ProductStore],
})
export class ProductListComponent implements OnInit{

  readonly store = inject(ProductStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly confirm = inject(ConfirmService);
  private readonly toastService = inject(ToastService);
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private readonly productService = inject(ProductService);

  stacks = new SafeStack();

  clickedRows = new Set<Product>();

  _flatBread = new Subject<'flat bread'>();
  _meat = new Subject<'meat'>();
  _sauce = new Subject<'sauce'>();
  _tomato = new Subject<'tomato'>();
  _cabbage = new Subject<'cabbage'>();

  ref: DynamicDialogRef | undefined;
  durum$!: Observable<Durum>;
  items = signal<ProductResponse[]>([]);
  product$ = toObservable(this.store.selectedProduct);

  ngOnInit(): void {
    this.store.loadProducts(undefined);
    this.items().sort((a, b) => 1 * a.name.localeCompare(b.name))
    this.durum$ = zip(
      this._flatBread.pipe(tap(console.log)),
      this._meat.pipe(tap(console.log)),
      this._sauce.pipe(tap(console.log)),
      this._tomato.pipe(tap(console.log)),
      this._cabbage.pipe(tap(console.log)),
    ).pipe(
      tap((durum) => console.log('Enjoy: ', durum))
    );

    //this.clickedRows.add()
    console.log('Store: ', this.store.products());
    console.log('Store: ', this.store.isLoading());
    console.log('Store: ', this.store.filter());
  }

  updateQuery(query: string): void {
    this.store.updateQuery(query);
  }

  updateOrder(order: Order): void {
    this.store.updateOrder(order);
  }

  addProduct(): void {
    const product: ProductResponse = {
      id: this.store.productsCount() + 1,
      name: 'Telephone',
      uniqueCode: "D348d-fdgfe-sbgbf-dbn32-ju8dg",
      description: "Il s'agit de la description de Telephone."
    };

    const productRequest : ProductRequest = {
      name: product.name,
      description: product.description
    };

    //this.store.add(product);
    console.log('Store products length 1: ', this.store.productsCount());
    this.store.addProduct(productRequest);
    console.log(this.store.products());
  }

  editProduct(product: ProductResponse): void {
    //this.store.updateSelectedProduct(product);
    //this.router.navigate(['products', 'edit', product.id]);
    this.store.getCategory(product.uniqueCode);

    this.product$.pipe(
      tap((prod) => {
        if(prod) {
          const navigationExtras: NavigationExtras = {
            state: {
              data: prod
            }
          };
          this.router.navigate(['categories', 'edit', prod?.uniqueCode], navigationExtras);
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  deleteProduct(product: ProductResponse): void {
    this.confirm.showConfirmDelete(
      `Êtes-vous sûr de vouloir supprimer le produit ${product.name} ?`,
      () => {
        //this.store.updateSelectedProduct(product);
        this.store.deleteProduct(product);
      },
      () => {
        console.log('Deletion cancelled');
      },
      'pi pi-exclamation-triangle',
      'Supprimer un produit',
    );
    console.log('Product to delete: ', product);
    console.log('Store products before deletion: ', this.store.products());
    console.log('Store products count before deletion: ', this.store.productsCount());

  }

  showConfirm(): void {
    //this.confirm.showConfirmDelete('Je suis la notification', '','Supprimer un produit');
  }

  showNotification(): void {
    this.toastService.showSuccess('Je suis la notification', 'Notification');
    console.log(this.productService.getFullUrl())
  }

  onShowModal(): void {
    this.ref = this.dialogService.open(ProductComponent, {
        header: 'Ajouter un étudiant',
        width: '60vw',
        modal:true,
        data: {
          name: 'Mr. Wakeu Georges Favier'
        },
        appendTo: "body",
        closable: true,
        baseZIndex: 10000,
        breakpoints: {
            '960px': '75vw',
            '640px': '90vw'
        },
    });

    setTimeout(() => {
      //this.stacks.closeAllRefs();
      //console.log('All modal references closed');
    }, 3000);

    //this.stacks.push(this.ref);
    //console.log('Stack size:', this.stacks.size());
    //console.log('Stack elements:', this.stacks.peek());

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
