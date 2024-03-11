import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TooltipComponent } from '../../../components/tooltip/tooltip.component';
import { CommonModule } from '@angular/common';
import { WideStorageService } from '../../../services/wide-storage.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Web3WalletService } from '../../../services/web3-wallet.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { firstValueFrom } from 'rxjs';
import { CredentialHelperService } from '../../../services/credential-helper.service';

@Component({
  selector: 'app-presentation-request',
  standalone: true,
  imports: [CommonModule, RouterLink, TooltipComponent],
  templateUrl: './presentation-request.component.html',
  styleUrl: './presentation-request.component.scss'
})
export class PresentationRequestComponent implements OnInit {
  domainOrigin: string = '';
  presentationConfig: any = null;
  pageLoaded: boolean = false;
  isProcessing: boolean = false;

  constructor(private router: Router, private wideStorageService: WideStorageService, private httpClient: HttpClient, private web3WalletService: Web3WalletService, private toastNotificationService: ToastNotificationService, private credentialHelperService: CredentialHelperService) { }

  ngOnInit(): void {
    const historyState = history.state;

    this.domainOrigin = historyState.domainOrigin;
    this.presentationConfig = historyState.presentationConfig;

    //TODO: Redirect and error if domain origin is not found;

    this.pageLoaded = true;
  }

  formatPredicates(predicates: any): any {
    if (predicates) {
      return predicates.map((predicate: any) => {
        return `${predicate.property} ${predicate.op} '${predicate.value}'`;
      });
    } else {
      return null;
    }
  }

  reject() {
    window.location.href = this.presentationConfig.rejectUri ?? this.presentationConfig.sourceUri;
  }

  async prepareRequest() {
    if (this.web3WalletService.isConnectedToWallet()) {
      const account = await this.web3WalletService.getAccount();
      if (account) {
        this.isProcessing = true;
        //1. Get Issued Credentials
        await this.wideStorageService.getUserIssuedCredentials(account).subscribe({
          next: async (response: HttpResponse<any>) => {
            const issuedCredentials = response.body;

            if (response.status == 204) {
              this.toastNotificationService.info('Loading credentials', `No credentials found for ${account}`);
              this.isProcessing = false;
            } else {
              //2. Filter on credentials that meet required criteria
              const matchingCredentialIssuers = this.credentialHelperService.findMatchingCredentials(issuedCredentials, this.presentationConfig.credential, true);

              if (matchingCredentialIssuers.length == 0) {
                this.toastNotificationService.error("No credentials found", `No matching credentials found (${this.presentationConfig.credential.type.join(', ')})`);
                this.isProcessing = false;
                console.error(`No matching credentials found (${this.presentationConfig.credential.type.join(', ')})`);
              } else {
                if (matchingCredentialIssuers.length > 1) {
                  this.toastNotificationService.info("Multiple credentials found", `Multiple credentials matching (${this.presentationConfig.credential.type.join(', ')}) found. Please identify the one to present!`);
                  this.isProcessing = false;
                  this.router.navigateByUrl('present/multi-select', { state: { credentialList: matchingCredentialIssuers, presentationConfig: this.presentationConfig, domainOrigin: this.domainOrigin } });
                } else {
                  //3. Fetch and decrypt payload
                  const credentialIssuer = matchingCredentialIssuers[0];
                  const encryptedCredential = await this.credentialHelperService.getCredentialsForIssuer(account, credentialIssuer.wideInternalId);
                  const decryptedCredential = await this.credentialHelperService.decryptCredential(encryptedCredential.payload);

                  //4. Process request
                  const processedCredential = await this.credentialHelperService.processCredential(credentialIssuer, encryptedCredential, decryptedCredential, this.presentationConfig);

                  //5. Navigate to Review screen
                  this.router.navigateByUrl('present/confirm', { state: { processedCredential: processedCredential, presentationConfig: this.presentationConfig, domainOrigin: this.domainOrigin } });
                }
              }
            }
          },
          error: (res) => {
            this.toastNotificationService.error(res.statusText, `Failed to load credentials (${res.status})`);
            console.error('Failed to load credentials', res);
            this.isProcessing = false;
          }
        });
      } else {
        this.toastNotificationService.error("Unexpected Error", `Failed to retrieve account address from MetaMask`);
        console.error('Cannot retrieve account from metamask');
      }
    } else {
      this.toastNotificationService.error("Unexpected Error", `Failed to connect to MetaMask`);
      console.error('Not connected to metamask!');
    }
  }
}
