import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { ToastComponent } from '../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastNotificationService {
  private viewContainerRef: ViewContainerRef | null = null;

  constructor() { }

  // Call this method in app.component.ts to set the viewContainerRef
  public setViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  public info(title: string, message: string, duration = 5000) {
    this.showToast(title, message, 'info', duration);
  }

  public error(title: string, message: string, duration = 5000) {
    this.showToast(title, message, 'error', duration);
  }

  // ... similarly for other types like 'success', 'error', etc.

  public showToast(title: string, message: string, type: string, duration: number) {
    if (this.viewContainerRef) {
      const componentRef = this.viewContainerRef.createComponent(ToastComponent);
      componentRef.instance.title = title;
      componentRef.instance.message = message;
      componentRef.instance.type = type;
      componentRef.instance.duration = duration;
      componentRef.instance.show = true;
    }
  }
}
