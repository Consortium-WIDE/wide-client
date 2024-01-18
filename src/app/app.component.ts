import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { ToastNotificationService } from './services/toast-notification.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('toastContainer', { read: ViewContainerRef }) toastContainer!: ViewContainerRef;

  constructor(private toastService: ToastNotificationService) {}

  ngAfterViewInit() {
    this.toastService.setViewContainerRef(this.toastContainer);
  }
}