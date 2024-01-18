import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-oauth-procedure-ui',
  standalone: true,
  imports: [],
  templateUrl: './oauth-procedure-ui.component.html',
  styleUrl: './oauth-procedure-ui.component.scss'
})
export class OauthProcedureUiComponent {
  @Input() activeStep = 0;

  getClassForStep(step: number): string {
    if (step < this.activeStep) { return 'completed' }
    if (step == this.activeStep) { return 'active' }
    return '';
  }
}
