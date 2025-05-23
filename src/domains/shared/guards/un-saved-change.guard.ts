import { CanDeactivateFn } from "@angular/router";

export interface FormComponent {
  hasUnsavedChanges(): boolean;
}

export const hasUnsavedChangesGuard: CanDeactivateFn<FormComponent> = (component) => {
  return component.hasUnsavedChanges() ? confirm('Des modifications non sauvegardées. Quitter ?') : true ;
}
