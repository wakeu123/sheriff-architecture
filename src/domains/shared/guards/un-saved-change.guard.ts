import { CanDeactivateFn } from "@angular/router";
import { UnsaveService } from "../services/unsaved/unsave.service";
import { inject } from "@angular/core";

export interface FormComponent {
  hasUnsavedChanges(): boolean;
}

export const hasUnsavedChangesGuard: CanDeactivateFn<FormComponent> = (component) => {
  return inject(UnsaveService).closeComponent(component.hasUnsavedChanges());
}
