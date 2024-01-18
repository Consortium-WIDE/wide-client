import { Component, ElementRef, HostListener, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-wide-dropdown',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WideDropdownComponent),
      multi: true,
    }
  ],
  templateUrl: './wide-dropdown.component.html',
  styleUrl: './wide-dropdown.component.scss'
})
export class WideDropdownComponent implements ControlValueAccessor {
  @Input() options: string[] = []; // Accept options as input
  @Input() prompt?: string = 'Please select an option'

  selectedValue: string | null = null;
  isOpen = false;

  onChange: any = () => {};
  onTouch: any = () => {};

  constructor(private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  selectOption(option: string): void {
    this.selectedValue = option;
    this.onChange(option);
    this.toggleDropdown();
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }
}