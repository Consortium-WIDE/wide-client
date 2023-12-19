import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-encrypted-credential',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './encrypted-credential.component.html',
  styleUrl: './encrypted-credential.component.scss'
})
export class EncryptedCredentialComponent {
  @Input() isDecrypting: boolean = false;
}
