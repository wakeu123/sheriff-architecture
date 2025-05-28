import { Component } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { ProductListComponent } from '@domains/products/feature/product-list/product-list.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [ProductListComponent, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  //pm i @ngspot/ngx-errors très important pour gérer les erreurs des formulaires
  title = 'sheriff-architecture';

  toggleDarkMode(ade: ValidationErrors) {
    console.log(ade);
  }
}
