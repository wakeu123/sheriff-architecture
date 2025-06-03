import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { booleanAttribute, Component, input, OnInit, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelComponent } from "../../shared/components/panel/panel.component";
import { ProductFormType } from '../data/models/product-form-type';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ButtonModule, TextareaModule, InputTextModule, FormsModule, PanelComponent, ReactiveFormsModule],
  styleUrl: './product.component.css',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {

  // nbeDraf = input.required<number>();
  // productName = input('', {transform: trimString});


  form!: FormGroup<ProductFormType>;

  value = signal('');
  isAvailable = input.required({ transform: booleanAttribute });

  ngOnInit(): void {
    //console.log(this.nbeDraf());
    this.form = new FormGroup({
      objet: new FormControl<string>('', { nonNullable: true }),
      reference: new FormControl<string>('', { nonNullable: true }),
      description: new FormControl<string>('', { nonNullable: true }),
      etatCourrier: new FormControl<string>('', { nonNullable: true }),
      natureCourrier: new FormControl<string>('', { nonNullable: true }),
      prioriteCourrier: new FormControl<string>('', { nonNullable: true }),
      utilisateurCreation: new FormControl<string>('', { nonNullable: true })
    });
  }

  onCancel(): void {
    console.log('')
  }
}

// function trimString(value: string | undefined): string {
//   return value?.trim() ?? '';
// }
