import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in')
      ]),
      transition(':leave',
        animate('400ms ease-out', style({ opacity: 0 })))
    ])
  ]
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() show = false;
  @Input() title = '';
  @Input() message = '';
  @Input() type = '';
  @Input() duration = 3000;

  private hideTimeout: any;

  ngOnInit() {
    this.resetTimeout();
  }

  ngOnDestroy() {
    this.clearTimeout();
  }

  getIconClass(): string {
    switch (this.type) {
      case 'info':
        return 'mdi mdi-information';
      case 'warning':
        return 'mdi mdi-alert';
      case 'error':
        return 'mdi mdi-close-circle';
      case 'success':
        return 'mdi mdi-check-circle';
      default:
        return 'mdi mdi-information';
    }
  }

  closeToast() {
    this.show = false;
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  private resetTimeout() {
    this.clearTimeout();
    this.hideTimeout = setTimeout(() => this.closeToast(), this.duration);
  }

  private clearTimeout() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
}
