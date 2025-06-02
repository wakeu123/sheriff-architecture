import { ValidationErrors } from "@angular/forms";

export const errorMesages: Record<string, (errors: ValidationErrors) => string | undefined> = {
  required: () => `Ce champ est obligatoire.`,
  min: ({ min }) => `Min value required is ${min}`
}
