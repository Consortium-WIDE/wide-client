import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kitchen-sink',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kitchen-sink.component.html',
  styleUrl: './kitchen-sink.component.scss'
})
export class KitchenSinkComponent {
  textboxValue = '';
  radioValue = '';
  radioValueB = '';
  checkboxValue = false;

  buttonClick(msg: string): void {
    alert(`Clicked ${msg}`);
  }
}
