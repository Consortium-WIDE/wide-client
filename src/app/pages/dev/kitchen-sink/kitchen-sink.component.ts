import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WideDropdownComponent } from '../../../components/wide-dropdown/wide-dropdown.component';

@Component({
  selector: 'app-kitchen-sink',
  standalone: true,
  imports: [CommonModule, FormsModule, WideDropdownComponent],
  templateUrl: './kitchen-sink.component.html',
  styleUrl: './kitchen-sink.component.scss'
})
export class KitchenSinkComponent {
  textboxValue = '';
  radioValue = '';
  radioValueB = '';
  checkboxValue = false;
  checkboxValue2 = true;
  selectedOption = '';

  buttonClick(msg: string): void {
    alert(`Clicked ${msg}`);
  }
}
