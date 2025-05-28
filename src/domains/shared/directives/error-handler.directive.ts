import { AfterViewInit, Directive, inject, Input, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormControlDirective, ValidationErrors } from '@angular/forms';
import { Nullable } from 'primeng/ts-helpers';
import { BehaviorSubject, distinctUntilChanged, startWith } from 'rxjs';

@Directive({
  selector: '[appErrorHandler]',
  standalone: true
})
export class ErrorHandlerDirective implements AfterViewInit {
  @Input() serverErrors?: BehaviorSubject<Record<string, string[]>>;
  @Input('appErrorHandler') fieldName: Nullable<string>;

  private renderer = inject(Renderer2);
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);
  private formGroupDirective = inject(FormControlDirective);

  control: Nullable<AbstractControl<unknown, unknown>>;

  ngAfterViewInit(): void {
    if(this.fieldName) {
      this.control = this.formGroupDirective.form.get(this.fieldName);

      this.control?.statusChanges.pipe(
        startWith(this.control.status),
        distinctUntilChanged()
      ).subscribe(()  => this.updateView());
    }
  }

  private updateView(): void {
    console.log('');

  }

  private getErroMessage(errors: ValidationErrors): Nullable<string>{
    if(errors) {
      console.log(errors)
    }
    return null;
  }
}

// import {AfterViewInit, DestroyRef, Directive, ElementRef, inject, input} from '@angular/core';
// import {AbstractControl, FormGroupDirective, ValidationErrors} from '@angular/forms';
// import {tap} from 'rxjs';
// import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
// import { errorsMesages } from '../utils/errors-messages';

// @Directive({  
//   selector: '[appFormError]',
//   standalone: true
// })
// export class FormErrorDirective implements AfterViewInit {  
//   formGroupDirective = inject(FormGroupDirective);  
//   elementRef = inject(ElementRef);  
//   destroyRef = inject(DestroyRef);  
//   appFormError = input.required<string>()  
//   formControl: AbstractControl<unknown, unknown> | null = null;  
  
//   ngAfterViewInit(): void {    
//     this.elementRef.nativeElement.classList.add('invalid-text');    
//     this.formControl = this.formGroupDirective?.form.get(this.appFormError())    
//     if (this.formControl) {      
//       this.formControl.valueChanges.pipe(        
//         tap(() => {          
//           if (this.formControl?.getError('serverError')) {            
//             this.formControl?.setErrors(null)        
//             }        
//           }),        
//           takeUntilDestroyed(this.destroyRef),      
//         ).subscribe()      
//         this.formControl.statusChanges.pipe(        
//           tap(_ => {          
//             if (this.formControl?.invalid && (this.formControl.dirty || this.formControl.touched)) {            
//               const error = this.errorMessage(this.formControl?.errors)            
//               if (error) {              
//                 this.elementRef.nativeElement.textContent = error            
//               } 
//               else {              
//                 this.elementRef.nativeElement.textContent = ''            
//               }          
//             } 
//             else {            
//               this.elementRef.nativeElement.textContent = ''          
//             }        
//           }),        
//           takeUntilDestroyed(this.destroyRef)      
//         ).subscribe()    
//       }  
//     } 
     
//     private errorMessage(errors: ValidationErrors | null) {    
//       if (errors) {      
//         const key = Object.keys(errors)[0];      
//         const errorMessage = errorsMesages[key];      
//         return errorMessage ? errorMessage(errors[key]) : null;    
//       }    
//       return null;  
//     }
//   }