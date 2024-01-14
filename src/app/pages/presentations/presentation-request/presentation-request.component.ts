import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TooltipComponent } from '../../../components/tooltip/tooltip.component';

@Component({
  selector: 'app-presentation-request',
  standalone: true,
  imports: [RouterLink, TooltipComponent],
  templateUrl: './presentation-request.component.html',
  styleUrl: './presentation-request.component.scss'
})
export class PresentationRequestComponent {

  presentationReq: any = {
    "verifier": {
      "name": "University of Malta",
      "redirect_url": "https://google.com"
    },
    "credential": { 
      "description": "Google Profile",
      "type": "Google OAuth"
    },
    "request": {
      "encrypted": ["name", "surname"],
      "decrypted": ["profileId", "email"]
    }
  }
}
