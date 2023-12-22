import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-wide-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WideInputComponent),
      multi: true
    }
  ],
  templateUrl: './wide-input.component.html',
  styleUrl: './wide-input.component.scss'
})
export class WideInputComponent implements ControlValueAccessor {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) name!: string;
  @Input() errorMessage: string = '';
  @Input() style: string = 'default';

  value: string = '';
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // If you have an input method for binding `input` event in HTML
  onInput(evt: any): void {
    this.value = evt.target.value;
    this.onChange(this.value);
    this.onTouched();
  }

  getStyle(): string {
    if (this.errorMessage.length > 0){
      return 'label-error';
    }
    
    return `label-${this.style}`
  }
}
