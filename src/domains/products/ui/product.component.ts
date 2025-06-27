import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogConfig, DynamicDialogRef, } from 'primeng/dynamicdialog';
import { ProductFormType } from '../data/models/product-form-type';
import { PanelComponent } from "../../shared/components/panel/panel.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { booleanAttribute, Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { City } from '../data/models/city-model';
import { FormComponent } from '@domains/shared/guards/un-saved-change.guard';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    ButtonModule, TextareaModule,
    InputTextModule, FormsModule,
    PanelComponent, ReactiveFormsModule,
    SelectModule
  ],
  styleUrl: './product.component.css',
  templateUrl: './product.component.html',
  providers: []
})
export class ProductComponent implements OnInit, OnDestroy, FormComponent {

  hasUnsavedChanges(): boolean {
    return true;
  }

  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly dialogDataConfig = inject(DynamicDialogConfig);

  form!: FormGroup<ProductFormType>;

  value = signal('');
  name = signal('');
  cities = signal<City[]>([]);
  isAvailable = input.required({ transform: booleanAttribute });

  ngOnInit(): void {
    this.cities.set([
      { name: 'Rome', code: 'RM' },
      { name: 'Paris', code: 'PRS' },
      { name: 'London', code: 'LDN' },
      { name: 'New York', code: 'NY' },
      { name: 'Istanbul', code: 'IST' }
    ]);

    if(this.dialogDataConfig.data) {
      this.name.set(this.dialogDataConfig.data.name);
      console.log(this.dialogDataConfig.data.name);
    }

    this.form = new FormGroup({
      city: new FormControl<City | undefined>(undefined, { nonNullable: true, validators: Validators.required }),
      objet: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      reference: new FormControl<string>('', { nonNullable: true }),
      description: new FormControl<string>('', { nonNullable: true }),
      etatCourrier: new FormControl<string>('', { nonNullable: true }),
      natureCourrier: new FormControl<string>('', { nonNullable: true }),
      prioriteCourrier: new FormControl<string>('', { nonNullable: true }),
      utilisateurCreation: new FormControl<string>(this.name(), { nonNullable: true })
    });
  }

  onSave(): void {
    this.form?.markAllAsTouched();
    if(!this.form?.valid) return;
    console.log(this.form?.getRawValue());
    this.dialogRef.close(this.form?.getRawValue());
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    console.log('Product component closed...')
  }
}

// function trimString(value: string | undefined): string {
//   return value?.trim() ?? '';
// }
