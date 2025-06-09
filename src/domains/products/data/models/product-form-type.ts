import { FormControl } from "@angular/forms"
import { City } from "./city-model";

export interface ProductFormType {
  objet: FormControl<string>;
  reference: FormControl<string>;
  description: FormControl<string>;
  etatCourrier: FormControl<string>;
  city: FormControl<City | undefined>;
  natureCourrier: FormControl<string>;
  prioriteCourrier: FormControl<string>;
  utilisateurCreation: FormControl<string>;
}
