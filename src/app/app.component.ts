import { ButtonModule } from 'primeng/button';
import { Component, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { PanelComponent } from "../domains/shared/components/panel/panel.component";
import { ProductListComponent } from "../domains/products/feature/product-list/product-list.component";

@Component({
  selector: 'app-root',
  imports: [ButtonModule, PanelComponent, ProductListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

  //pm i @ngspot/ngx-errors très important pour gérer les erreurs des formulaires
  title = 'sheriff-architecture';

  ngOnInit(): void {
    // const loader = document.querySelector(".global-loader");
    // window.addEventListener("load", () => {
    //   (loader as HTMLDivElement).style.display = 'none';
    // });
    console.log('')
  }

  toggleDarkMode(ade: ValidationErrors) {
    console.log(ade);
  }
}
