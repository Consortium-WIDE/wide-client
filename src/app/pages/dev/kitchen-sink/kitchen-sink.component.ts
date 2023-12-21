import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WideDropdownComponent } from '../../../components/wide-dropdown/wide-dropdown.component';
import { ToastNotificationService } from '../../../services/toast-notification.service';

@Component({
  selector: 'app-kitchen-sink',
  standalone: true,
  imports: [CommonModule, FormsModule, WideDropdownComponent],
  templateUrl: './kitchen-sink.component.html',
  styleUrl: './kitchen-sink.component.scss'
})
export class KitchenSinkComponent {
  form = {
    textboxValue: '',
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
