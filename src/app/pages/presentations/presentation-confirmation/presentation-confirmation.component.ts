import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WideModalComponent } from '../../../components/wide-modal/wide-modal.component';
import { HttpClient } from '@angular/common/http';
import { Web3WalletService } from '../../../services/web3-wallet.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { canonicalize } from 'json-canonicalize';
import { HistoryService } from '../../../services/history.service';

@Component({
  selector: 'app-presentation-confirmation',
  standalone: true,
  imports: [CommonModule, WideModalComponent],
  templateUrl: './presentation-confirmation.component.html',
  styleUrl: './presentation-confirmation.component.scss'
})
export class PresentationConfirmationComponent implements OnInit {
  pageLoaded: boolean = false;
  processedCredential: any = null;
  presentationConfig: any = null;
  domainOrigin: string = '';
  showModal: boolean = false;
  isPresenting: boolean = false;

  constructor(private httpClient: HttpClient, private web3WalletService: Web3WalletService, private toastNotificationService: ToastNotificationService, private historyService: HistoryService) { }

  ngOnInit(): void {
    const { processedCredential, presentationConfig, domainOrigin } = history.state;
    this.processedCredential = processedCredential;
    this.presentationConfig = presentationConfig;
    this.domainOrigin = domainOrigin;

    this.pageLoaded = true;
  }

  async present() {
    this.isPresenting = true;

    //1. Generate a token
    const token = this.generateSecureToken(32);
    let signedMessage = null;

    if (this.presentationConfig.requireMessageSignature ?? false) {
      //TODO: This should ideally be fetch from the server to have 1 source.
      const messageSignature = this.generatePresentationSignature(this.processedCredential, this.presentationConfig.rpName);
      signedMessage = await this.web3WalletService.signMessage(messageSignature);
      this.processedCredential.signedMessage = signedMessage;
    }

    //2. Log on RP Api
    this.httpClient.post(this.presentationConfig.serverApiEndpoint, {
      key: token,
      data: this.processedCredential
    }).subscribe({
      next: (response) => {
        //3. Register in History
        this.historyService.logPresentation({
          name: this.presentationConfig.rpName,
          domain: this.presentationConfig.sourceUri,
          credential: this.presentationConfig.credential,
          iconUri: this.presentationConfig.iconUri ?? '',
        }).subscribe({
          next: (response) => {
            this.isPresenting = false;

            //4. Redirect to redirectUri and include token
            window.location.href = `${this.presentationConfig.redirectUri}?token=${token}`
          },
          error: (error) => {
            this.isPresenting = false;
            // Handle the error here
            console.error('Error registering presentation', error);
            this.toastNotificationService.error(error.statusText, `Failed to register presentation (${error.status})`);
          }
        })
      },
      error: (error) => {
        // Handle the error here
        this.isPresenting = false;
        console.error('Error uploading data', error);
        this.toastNotificationService.error(error.statusText, `Failed to present credentials (${error.status})`);
      }
    });
  }

  reject() {
    window.location.href = this.presentationConfig.sourceUri;
  }

  //TODO: place in a shared library
  generatePresentationSignature(processedCredential: any, rpName: string): string {
    processedCredential = JSON.parse(canonicalize(processedCredential)); //We do this to have issuerDomains and credentials in order

    let msg = `I, holder of account '${processedCredential.credentialSubject.id}' declare that the information below being presented to '${rpName}' is true and correct:\r\n`;

    msg = `By signing this message, I, holder of Ethereum address ${processedCredential.credentialSubject.id}, hereby confirm, represent, and warrant that the data I am sharing through this credential presentation is true, accurate, correct, unaltered, and complete. I understand and agree that the third party I am sharing data with ('${rpName}') may, and is entitled without further inquiry to, rely and act upon the credential presentation or any data shared herein in deciding whether to provide, or continue to provide, services to me.

    I agree to notify the third party I am sharing data with, in writing before or as soon as reasonably practicable following any information in the credential presentation or any of the data herein ceasing to be true, accurate, correct, and complete.
    
    I confirm that I have the full power and authority to enter into the terms and statements made herein.`

    processedCredential.credentialSubject.issuerDomains.forEach((issuerDomain: any) => {
      msg += `\r\n\r\nSource: ${issuerDomain.label}\r\n`;
      issuerDomain.data.credentials.forEach((credential: any) => {
        msg += `- ${credential.name}: ${credential.value}\r\n`;
      });
    });

    return msg;
  }

  //TODO: place in a dedicated service
  generateSecureToken(length: number): string {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    let token = '';

    for (let i = 0; i < array.length; i++) {
      token += validChars.charAt(array[i] % validChars.length);
    }

    return token;
  }

  truncatePredicateValue(credential: any): string {
    if (credential.type === 'proof') {
      return (credential.value.slice(0, 32)) + '...';
    }

    return credential.value;
  }
}
