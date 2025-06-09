import { ButtonModule } from 'primeng/button';
import { Component, OnInit, signal } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ProductListComponent } from "../domains/products/feature/product-list/product-list.component";

@Component({
  selector: 'app-root',
  imports: [ButtonModule, DatePipe, ProductListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    //{ provide: LOCALE_ID, useValue: 'fr-FR' }
  ]
})
export class AppComponent implements OnInit {

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
  }

  toggleDarkMode(ade: ValidationErrors) {
    console.log(ade);
  }
}
