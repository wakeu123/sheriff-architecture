import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: 'app-colored-panel',
  standalone: true,
  imports: [],
  template: `
  <div class="box-container">
    <div class="box-header"></div>
    <h5 class="box-title text-sm ms-2 me-2">{{ title() }}</h5>
    <div class="box-content p-1 ms-2 me-2 mb-2">
      <ng-content />
    </div>
  </div>
  `,
  styleUrl: './panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanelComponent {

  title = input.required<string>();
}
