import { ConfirmService } from '@domains/shared/services/confirm/confirm.service';
import { ProductService } from '@domains/products/data/services/product.service';
import { ToastService } from '@domains/shared/services/toast/toast.service';
import { ProductComponent } from '@domains/products/ui/product.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Product } from '@domains/products/data/models/product.model';
import { SafeStack } from '@domains/shared/utils/safe-stack';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Observable, Subject, tap, zip } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';

export type Durum = ['flat bread', 'meat', 'sauce', 'tomato', 'cabbage'];


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ NgIf, AsyncPipe, JsonPipe, ButtonModule, ToastModule, RouterOutlet],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  providers: [ProductService, DialogService],
})
export class ProductListComponent implements OnInit{

  private readonly router = inject(Router);
  private readonly confirm = inject(ConfirmService);
  private readonly toastService = inject(ToastService);
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);

  stacks = new SafeStack();

  _flatBread = new Subject<'flat bread'>();
  _meat = new Subject<'meat'>();
  _sauce = new Subject<'sauce'>();
  _tomato = new Subject<'tomato'>();
  _cabbage = new Subject<'cabbage'>();

  ref: DynamicDialogRef | undefined;
  durum$!: Observable<Durum>;

  ngOnInit(): void {
    this.durum$ = zip(
      this._flatBread.pipe(tap(console.log)),
      this._meat.pipe(tap(console.log)),
      this._sauce.pipe(tap(console.log)),
      this._tomato.pipe(tap(console.log)),
      this._cabbage.pipe(tap(console.log)),
    ).pipe(
      tap((durum) => console.log('Enjoy: ', durum))
    );
  }

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
