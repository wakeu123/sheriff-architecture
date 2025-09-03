import { ValidationErrors } from "@angular/forms";

export const errorMesages: Record<string, (errors: ValidationErrors) => string | undefined> = {
  //required: () => `Ce champ est obligatoire.`,
  //min: ({ min }) => `Min value required is ${min}`

  pattern: () => 'Le format est incorrect',
  required: () => 'Ce champ est obligatoire',
  email: () => 'Veuillez entrer une adresse email valide',
  serverError: ({ error }) => `${error ?? 'Erreur serveur'}`,
  min: ({ min }) => `La valeur minimale autorisée est ${min}`,
  max: ({ max }) => `La valeur maximale autorisée est ${max}`,
  passwordMismatch: () => 'Les mots de passe ne correspondent pas',
  minlength: ({ requiredLength }) => `Minimum ${requiredLength} caractères requis`,
  maxlength: ({ requiredLength }) => `Maximum ${requiredLength} caractères autorisés`,
  // Ajoutez d'autres validateurs au besoin
}
