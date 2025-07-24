import { tap } from 'rxjs';
import { Nullable } from 'primeng/ts-helpers';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormGroupDirective, ValidationErrors } from '@angular/forms';
import { AfterViewInit, DestroyRef, Directive, ElementRef, inject, input, Renderer2, signal } from '@angular/core';
import { errorMesages } from '../utils/errors-messages';

@Directive({
  selector: '[appErrorFormHandler]',
  standalone: true
})
export class ErrorFormHandlerDirective implements AfterViewInit {

  serverErrors = input<Record<string, string[]>>();
  fieldName = input.required<string>({alias: 'appErrorFormHandler'});

  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);
  private readonly formGroupDirective = inject(FormGroupDirective);

  formControl = signal<AbstractControl<unknown, unknown> | null>(null);

  ngAfterViewInit(): void {

    this.renderer.addClass(this.elementRef.nativeElement, 'invalid-text');
    this.formControl.set(this.formGroupDirective.form.get(this.fieldName()));

    if(this.formControl()) {
      this.updateView();
    }
  }

  private updateView(): void {
    this.formControl()?.valueChanges.pipe(
        tap(() => {
          if(this.formControl()?.getError('serverError')){
            this.formControl()?.setErrors(null);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe();

      this.formControl()?.statusChanges.pipe(
        tap(() => {
          if(this.formControl()?.invalid && (this.formControl()?.touched || this.formControl()?.dirty)) {
            const error = this.getErroMessage(this.formControl()?.errors);
            if(error) {
              this.renderer.setProperty(this.elementRef.nativeElement, 'textContent', error);
            }
            else {
              this.renderer.setProperty(this.elementRef.nativeElement, 'textContent', '');
            }
          }
          else {
            this.renderer.setProperty(this.elementRef.nativeElement, 'textContent', '');
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe();
  }

  private getErroMessage(errors: Nullable<ValidationErrors>): Nullable<string> {
    if(errors) {
      const key = Object.keys(errors)[0];
      const errorMessage = errorMesages[key];
      return errorMessage ? errorMessage(errors[key]) : null;
    }
    return null;
  }
}

