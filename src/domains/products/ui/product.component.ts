import { booleanAttribute, Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  styleUrl: './product.component.css',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  nbeDraf = input.required<number>();

  isAvailable = input.required({ transform: booleanAttribute });

  ngOnInit(): void {
    console.log(this.nbeDraf());
  }
}
