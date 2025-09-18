import { ChangeDetectionStrategy, Component } from "@angular/core";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonDirective } from "primeng/button";

@Component({
  selector: 'app-add-hobbite',
  standalone: true,
  templateUrl: './ui-add-hobbite.component.html',
  styleUrl: './ui-add-hobbite.component.scss',
  imports: [InputTextModule, TextareaModule, CheckboxModule, RadioButtonModule, ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddHobbiteComponent {

}
