import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presentation-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './presentation-confirmation.component.html',
  styleUrl: './presentation-confirmation.component.scss'
})
export class PresentationConfirmationComponent {

  constructor() { }

  present() {
    window.location.href =  "https://google.com/?q=present";
  }

  reject() {
    window.location.href =  "https://google.com/?q=reject"
  }
}
