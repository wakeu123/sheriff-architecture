import { ButtonModule } from 'primeng/button';
import { booleanAttribute, Component, input, OnInit, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ButtonModule, InputTextModule, FormsModule],
  styleUrl: './product.component.css',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {

  nbeDraf = input.required<number>();
  productName = input('', {transform: trimString});

  value = signal('');
  isAvailable = input.required({ transform: booleanAttribute });

  ngOnInit(): void {
    console.log(this.nbeDraf());
  }
}

function trimString(value: string | undefined): string {
  return value?.trim() ?? '';
}
