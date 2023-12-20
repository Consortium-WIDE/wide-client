import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-google-signin-procedure',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-signin-procedure.component.html',
  styleUrl: './google-signin-procedure.component.scss'
})
export class GoogleSigninProcedureComponent {
  @Input() activeStep = 0;

  getClassForStep(step: number): string {
    if (step < this.activeStep) { return 'completed'}
    if (step == this.activeStep) { return 'active'}
    return '';
  }
}
