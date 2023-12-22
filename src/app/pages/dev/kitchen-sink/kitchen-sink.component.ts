import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WideDropdownComponent } from '../../../components/wide-dropdown/wide-dropdown.component';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { WideInputComponent } from '../../../components/wide-input/wide-input.component';

@Component({
  selector: 'app-kitchen-sink',
  standalone: true,
  imports: [CommonModule, FormsModule, WideDropdownComponent, WideInputComponent],
  templateUrl: './kitchen-sink.component.html',
  styleUrl: './kitchen-sink.component.scss'
})
export class KitchenSinkComponent {
  form = {
    textboxValue1: '',
    textboxValue2: 'Prefilled Text',
    textboxValue3: 'Invalid Data!',
    radioValue: '',
    radioValueB: '',
    checkboxValue: false,
    checkboxValue2: true,
    selectedOption: ''
  }

  constructor(private toastNotificationService: ToastNotificationService) { }

  buttonClick(msg: string): void {
    alert(`Clicked ${msg}`);
  }

  showToast(type: string): void {
    this.toastNotificationService.showToast('Toast Title', 'Butter be prepared for some toasty puns!', type, 5000);
  }
}
