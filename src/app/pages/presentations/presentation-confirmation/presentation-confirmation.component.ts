import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presentation-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './presentation-confirmation.component.html',
  styleUrl: './presentation-confirmation.component.scss'
})
export class PresentationConfirmationComponent {
  presentation: any = {
    "verifier": {
      "name": "University of Malta"
    },
    "timestamp": new Date().getTime(),
    "decrypted": [{"name": "profileId", "value": 123456}, {"name": "email", "value": "john.doe@nomail.net"}],
    "encrypted": [{"name": "name", "value": "syOOkBKSTXXmrMTQ2N6UO0l18Z2kxVUhVg=="}, {"name": "surname", "value": "Kf4nJHVq+PX4MviNfcO02RK2XZRCI6ie"}]
  }
  constructor() { }

  present() {
    window.location.href =  "https://google.com/?q=present";
  }

  reject() {
    window.location.href =  "https://google.com/?q=reject"
  }
}
