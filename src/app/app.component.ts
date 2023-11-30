import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClaimsProcessorService } from './services/claims-processor.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'wide-client';
  jsonData = JSON.stringify({ "key1": "value", "key2": "val2" });

  constructor(private claimsProcessorService: ClaimsProcessorService) {}

  async test(){
    try {
      // Try parsing the JSON data
      const parsedData = JSON.parse(this.jsonData);
      console.log('Parsed JSON:', parsedData);
      // Add further processing if necessary
      
      const encrypted = await this.claimsProcessorService.encryptData(parsedData);

      console.log('ENCRYPTED!!!', encrypted);
      this.claimsProcessorService.printHello();

    } catch (error) {
      // Handle parsing error
      console.error('Invalid JSON:', error);
    }
  }
}
