import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryAddFormType } from '@domains/shared/models/category.model';
import { SaveType } from '@domains/shared/models/save-type.mode';
import { CategoryFacade } from '../utils/category-fascade';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-category',
  standalone: true,
  styleUrl: './category.component.css',
  templateUrl: './category.component.html',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
  providers: [CategoryFacade],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent implements OnInit, OnDestroy {

  private readonly facade = inject(CategoryFacade);
  private readonly dialogRef = inject(DynamicDialogRef);

  form: FormGroup<CategoryAddFormType> | null = null;

  saveType = signal<SaveType>('SAVE_AND_CLOSE');

  ngOnInit(): void {
    this.form = new FormGroup<CategoryAddFormType>({
      name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      description: new FormControl<string>('', { nonNullable: true, validators: Validators.required })
    });

    this.modalClose();
  }

  save(saveType: SaveType): void {
    this.saveType.set(saveType);

    this.form?.markAllAsTouched();
    if(!this.form?.valid) return;

    this.facade.add(this.form.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  modalClose(): void {
    this.facade.category$.subscribe((response) => {
      if(response && this.saveType() === 'SAVE_AND_CLOSE') {
        this.facade.resetNewCategory();
        this.dialogRef.close();
      } else if(response && this.saveType() === 'SAVE_AND_CONTINUE') {
        this.facade.resetNewCategory();
        this.form?.reset();
      }
    });
  }

  ngOnDestroy(): void {
    this.saveType.set('SAVE_AND_CLOSE');
  }

}
