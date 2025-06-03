import { FormControl } from "@angular/forms"

export interface ProductFormType {
  objet: FormControl<string>;
  reference: FormControl<string>;
  description: FormControl<string>;
  etatCourrier: FormControl<string>;
  natureCourrier: FormControl<string>;
  prioriteCourrier: FormControl<string>;
  utilisateurCreation: FormControl<string>;
}
