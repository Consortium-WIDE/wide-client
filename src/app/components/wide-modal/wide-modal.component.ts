import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wide-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wide-modal.component.html',
  styleUrl: './wide-modal.component.scss'
})
export class WideModalComponent {
  @Input() showModal = false;
}
