import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-multi-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multi-button.component.html',
  styleUrl: './multi-button.component.scss'
})
export class MultiButtonComponent {
  @Input() label: string = 'Actions';
  @Input() buttons: ButtonConfig[] = [];
  @Input() btnSize: string = '';
  @Output() buttonClick = new EventEmitter<string>();

  menuVisible = false;

  toggleMenu() {
      this.menuVisible = !this.menuVisible;
  }

  onButtonClick(button: ButtonConfig) {
      this.buttonClick.emit(button.action);
      this.menuVisible = false; // Optionally close the menu
  }
}

export interface ButtonConfig {
  label: string;
  action: string;
}