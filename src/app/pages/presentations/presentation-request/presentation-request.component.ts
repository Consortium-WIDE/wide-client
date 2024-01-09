import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-presentation-request',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './presentation-request.component.html',
  styleUrl: './presentation-request.component.scss'
})
export class PresentationRequestComponent {

  decrypt(credential: any){
    alert(`decrypt ${credential} mock`);
  }
}
