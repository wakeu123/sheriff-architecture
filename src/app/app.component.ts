import { ButtonModule } from 'primeng/button';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ProductListComponent } from "../domains/products/feature/product-list/product-list.component";
import { ToastModule } from 'primeng/toast';
//import { GlobalLoaderComponent } from "../domains/shared/components/global-loader/global-loader.component";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CryptoService } from '@domains/shared/services/crypto/crypto.service';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, ProductListComponent, ToastModule, ConfirmDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    //{ provide: LOCALE_ID, useValue: 'fr-FR' }
    CryptoService
  ]
})
export class AppComponent implements OnInit {

  private readonly cryptoService = inject(CryptoService);

  //pm i @ngspot/ngx-errors très important pour gérer les erreurs des formulaires
  dateString = signal('');
  title = 'sheriff-architecture';

  ngOnInit(): void {
    // const loader = document.querySelector(".global-loader");
    // window.addEventListener("load", () => {
    //   (loader as HTMLDivElement).style.display = 'none';
    // });

    // Dans votre composant
    const date = new Date();
    const formattedDate = new DatePipe('fr-FR').transform(date, 'dd/MM/yyyy');
    if(formattedDate != null) {
      this.dateString.set(formattedDate);
    }
    console.log('Date formaté: ', formattedDate);
    console.log('Date formatée: ', this.dateString());

    const users = [
      {
        id: null,
        name: 'wakeu'
      },
      {
        id: 2,
        name: 'akono'
      }
    ];
    console.log('Values :', Object.values(users[0]));
    console.log('Some :', users.some(user => user.id));
    console.log('Every :', users.every(user => user.id));
    console.log('CryptoKey : ', this.cryptoService.getKey());
  }

  toggleDarkMode(ade: ValidationErrors) {
    console.log(ade);
  }
}
