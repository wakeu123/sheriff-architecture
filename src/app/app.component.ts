import { CryptoService } from '@domains/shared/services/crypto/crypto.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ValidationErrors } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DatePipe } from '@angular/common';
//import { GlobalLoaderComponent } from "../domains/shared/components/global-loader/global-loader.component";

@Component({
  selector: 'app-root',
  imports: [
    ButtonModule, ToastModule,
    ConfirmDialogModule, RouterLink,
    RouterOutlet
  ],
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
  title = 'Sheriff architecture';

  ngOnInit(): void {
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

    const name = 'WAKEU Georges Favier';
    const enscryt = this.cryptoService.encrypt(name);
    console.log('CryptoKey 1: ', enscryt);
    console.log('CryptoKey 2: ', this.cryptoService.decrypt(enscryt));
  }

  toggleDarkMode(ade: ValidationErrors) {
    console.log(ade);
  }
}
