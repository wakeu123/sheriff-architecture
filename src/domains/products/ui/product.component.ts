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
import { UnsaveService } from '@domains/shared/services/unsaved/unsave.service';
import { GeneralArrayStore } from '@domains/shared/services/store/general-array.store.util';

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
  providers: [GeneralArrayStore<City>]
})
export class ProductComponent implements OnInit, OnDestroy {

  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly closedService = inject(UnsaveService);
  private readonly store = inject(GeneralArrayStore<City>);
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

    this.store.setItems(this.cities());

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
    console.table(this.store.items());
    this.form?.markAllAsTouched();
    if(!this.form?.valid) return;
    console.log(this.form?.getRawValue());
    this.dialogRef.close(this.form?.getRawValue());
  }

  onCancel(): void {
    console.log('Form status: ', this.form?.dirty);
    if(this.form?.dirty) {
      const found = this.closedService.closeComponent(true);
      if(found) this.dialogRef.close();
    }
    else { this.dialogRef.close(); }
  }

  ngOnDestroy(): void {
    console.log('Product component closed...')
  }
}

// function trimString(value: string | undefined): string {
//   return value?.trim() ?? '';
// }
