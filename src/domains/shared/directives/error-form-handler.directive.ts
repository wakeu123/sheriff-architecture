import { merge, tap } from 'rxjs';
import { Nullable } from 'primeng/ts-helpers';
import { errorMesages } from '../utils/errors-messages';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormGroupDirective, ValidationErrors } from '@angular/forms';
import { AfterViewInit, DestroyRef, Directive, ElementRef, inject, input, Renderer2, signal } from '@angular/core';

@Directive({
  selector: '[appErrorFormHandler]',
  standalone: true
})
export class ErrorFormHandlerDirective implements AfterViewInit {

  // Inputs avec valeurs par défaut plus explicites
  serverErrors = input<Record<string, string[]>>();
  fieldName = input.required<string>({alias: 'appErrorFormHandler'});

  // Injection des dépendances
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);
  private readonly formGroupDirective = inject(FormGroupDirective, { optional: true });

  formControl = signal<AbstractControl<unknown, unknown> | null>(null);

  // CSS class pour stylisation
  private readonly ERROR_CLASS = 'invalid-text';
  private readonly ERROR_CONTAINER_CLASS = 'error-container';

  ngAfterViewInit(): void {
    // Validation que le formGroupDirective est disponible
    if (!this.formGroupDirective) {
      console.warn('ErrorFormHandlerDirective: FormGroupDirective non trouvé');
      return;
    }

    // Création d'un conteneur pour les messages d'erreur
    this.createErrorContainer();

    //this.renderer.addClass(this.elementRef.nativeElement, this.ERROR_CLASS);
    this.formControl.set(this.formGroupDirective.form.get(this.fieldName()));

    if (!this.formControl()) {
      console.warn(`ErrorFormHandlerDirective: Contrôle "${this.fieldName()}" non trouvé`);
      return;
    }

    this.setupErrorHandling();
  }

  private createErrorContainer(): void {
    // Ajoute une classe au conteneur parent
    this.renderer.addClass(this.elementRef.nativeElement, this.ERROR_CONTAINER_CLASS);

    // Ajoute la classe pour le texte d'erreur
    this.renderer.addClass(this.elementRef.nativeElement, this.ERROR_CLASS);
  }

  private setupErrorHandling(): void {
    const control = this.formControl();
    if (!control) return;

    // Combine valueChanges et statusChanges pour moins de duplication
    merge(
      control.valueChanges.pipe(
        tap(() => this.clearServerErrors())
      ),
      control.statusChanges
    ).pipe(
      tap(() => this.updateErrorMessage()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    // Écoute aussi les changements d'erreurs serveur
    this.listenToServerErrors();

    // this.formControl()?.valueChanges.pipe(
    //     tap(() => {
    //       if(this.formControl()?.getError('serverError')){
    //         this.formControl()?.setErrors(null);
    //       }
    //     }),
    //     takeUntilDestroyed(this.destroyRef)
    // ).subscribe();

    // this.formControl()?.statusChanges.pipe(
    //   tap(() => {
    //     if(this.formControl()?.invalid && (this.formControl()?.touched || this.formControl()?.dirty)) {
    //       const error = this.getErroMessage(this.formControl()?.errors);
    //       if(error) {
    //         this.renderer.setProperty(this.elementRef.nativeElement, 'textContent', error);
    //       }
    //       else {
    //         this.renderer.setProperty(this.elementRef.nativeElement, 'textContent', '');
    //       }
    //     }
    //     else {
    //       this.renderer.setProperty(this.elementRef.nativeElement, 'textContent', '');
    //     }
    //   }),
    //   takeUntilDestroyed(this.destroyRef)
    // ).subscribe();
  }

  private clearServerErrors(): void {
    // if (this.formControl()?.getError('serverError')) {
    //   this.formControl()?.setErrors(null);
    // }

    const control = this.formControl();
    if (control?.getError('serverError')) {
      // Conserve les autres erreurs tout en supprimant serverError
      const errors = control.errors;
      if (errors) {
        delete errors['serverError'];
        const newErrors = Object.keys(errors).length > 0 ? errors : null;
        control.setErrors(newErrors);
      }
    }
  }

  private updateErrorMessage(): void {
    const control = this.formControl();
    if (!control) return;

    const shouldShowError = control.invalid && (control.touched || control.dirty);
    const errorMessage = shouldShowError ? this.getErroMessage(control.errors) : '';

    this.renderer.setProperty(this.elementRef.nativeElement, 'textContent', errorMessage);

    // Ajout/retrait de classe pour stylisation
    if (shouldShowError) {
      this.renderer.addClass(this.elementRef.nativeElement, 'has-error');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'has-error');
    }
  }

  private listenToServerErrors(): void {
    // Implémentation pour écouter les changements d'erreurs serveur
    // (à adapter selon votre implémentation)
    // Voici un exemple simple

    const control = this.formControl();
    if (!control) return;

    // Écoute les changements des erreurs serveur
    const serverErrors = this.serverErrors();

    // Vérifie si ce champ a des erreurs serveur
    if (serverErrors && serverErrors[this.fieldName()]) {
      const serverError = serverErrors[this.fieldName()].join(', ');

      // Ajoute l'erreur serveur aux erreurs existantes
      const currentErrors = control.errors || {};
      control.setErrors({
        ...currentErrors,
        serverError: serverError
      });

      // Force la mise à jour de l'affichage
      this.updateErrorMessage();
    }
  }

  private getErroMessage(errors: Nullable<ValidationErrors>): string {
    if(!errors) return '';

    //const key = Object.keys(errors)[0];
    //const errorMessage = errorMesages[key];
    //return errorMessage ? errorMessage(errors[key]) ?? 'Erreur inconnue' : 'Erreur inconnue';

    // Priorité aux erreurs serveur
    if (errors['serverError']) {
      const errorMesage = errorMesages['serverError'];
      //return errorMessages['serverError'](errors['serverError']);
      return errorMesage ? errorMesage(errors['serverError']) ?? 'Erreur serveur' : 'Erreur serveur';
    }

    // Traite les autres erreurs dans l'ordre des clés
    const errorKey = Object.keys(errors)[0];
    const errorMessageFn = errorMessages[errorKey];

    return errorMessageFn
      ? errorMessageFn(errors[errorKey])
      : `Erreur de validation: ${errorKey}`;
  }
}

