import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CategoryAddFormType } from '@domains/shared/models/category.model';
import { SaveType } from '@domains/shared/models/save-type.mode';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CategoryFacade } from '../utils/category-fascade';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-category',
  standalone: true,
  styleUrl: './category.component.css',
  templateUrl: './category.component.html',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
  providers: [CategoryFacade],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent implements OnInit {

  private readonly facade = inject(CategoryFacade);
  private readonly dialogRef = inject(DynamicDialogRef);

  form: FormGroup<CategoryAddFormType> | null = null;

  ngOnInit(): void {
    this.form = new FormGroup<CategoryAddFormType>({
      name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      description: new FormControl<string>('', { nonNullable: true, validators: Validators.required })
    });

    this.modalClose();
  }

  save(saveType: SaveType): void {
    console.log('Save type: ', saveType);

    this.form?.markAllAsTouched();
    if(!this.form?.valid) return;

    this.facade.add(saveType, this.form.value);
  }

  modalClose(): void {
    this.facade.category$.subscribe((response) => {
      if(response && this.facade.saveType === 'SAVE_AND_CLOSE') {
        this.dialogRef.close();
      } else if(response && this.facade.saveType === 'SAVE_AND_CONTINUE') {
        this.form?.reset();
      }
    });
  }

}
