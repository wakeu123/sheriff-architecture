import { Component, OnDestroy } from "@angular/core";
import { FormComponent } from "@domains/shared/guards/un-saved-change.guard";

@Component({
  selector: 'app-empty-router',
  standalone: true,
  template: ``
})
export default class EmptyRouterComponent implements FormComponent, OnDestroy {

  hasUnsavedChanges(): boolean {
    console.log('Empty component...');
    return true;
  }

  ngOnDestroy(): void {
    console.log('Closed empty component..');
  }
}
