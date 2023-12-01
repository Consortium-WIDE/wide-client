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
  inputData = JSON.stringify({ "key1": "value", "key2": "val2" });

  encryptedData: any = {};
  encryptedDataString: string = JSON.stringify(this.encryptedData);
  decryptedData: any = {};
  decryptedDataString: string = JSON.stringify(this.decryptedData);

  constructor(private claimsProcessorService: ClaimsProcessorService) { }

  async encryptClaim(onlyJson: boolean = true) {
    try {
      let data = this.inputData;

      if (onlyJson) {
        // Try parsing the JSON data
        data = JSON.parse(this.inputData);
      }

      this.encryptedData = await this.claimsProcessorService.encryptData(data);
      this.encryptedDataString = JSON.stringify(this.encryptedData);
    } catch (error) {
      // Handle parsing error
      console.error(error);
    }
  }

  async decryptClaim() {
    try {
      this.encryptedData = JSON.parse(this.encryptedDataString);
      this.decryptedData = await this.claimsProcessorService.decryptData(this.encryptedData);

      this.decryptedDataString = JSON.parse(this.decryptedData);

    } catch (error) {
      // Handle parsing error
      console.error(error);
    }
  }
}
