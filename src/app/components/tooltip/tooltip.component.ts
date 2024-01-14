import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {
  @Input() mdiIcon: string = 'help-circle-outline';
  @Input() position: string = '';
  @Input({ required: true }) message!: string;
}
