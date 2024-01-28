import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TooltipComponent } from '../../../components/tooltip/tooltip.component';
import { CommonModule } from '@angular/common';
import { WideStorageService } from '../../../services/wide-storage.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Web3WalletService } from '../../../services/web3-wallet.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { firstValueFrom } from 'rxjs';

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

  constructor(private router: Router, private wideStorageService: WideStorageService, private httpClient: HttpClient, private web3WalletService: Web3WalletService, private toastNotificationService: ToastNotificationService) { }

  ngOnInit(): void {
    const historyState = history.state;

    this.domainOrigin = historyState.domainOrigin;
    this.presentationConfig = historyState.presentationConfig;

    //TODO: Redirect and error if domain origin is not found;

    this.pageLoaded = true;
  }

  formatPredicates(predicates: any): any {
    return predicates.map((predicate: any) => {
      return `${predicate.property} ${predicate.op} '${predicate.value}'`;
    });
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
              const matchingCredentialIssuers = this.findMatchingCredentials(issuedCredentials, this.presentationConfig);

              if (matchingCredentialIssuers.length == 0) {
                this.toastNotificationService.error("No credentials found", `No matching credentials found (${this.presentationConfig.credential.join(', ')})`);
                this.isProcessing = false;
                console.error(`No matching credentials found (${this.presentationConfig.credential.join(', ')})`);
              } else {
                if (matchingCredentialIssuers.length > 1) {
                  this.toastNotificationService.info("Multiple credentials found", `Multiple credentials matching (${this.presentationConfig.credential.join(', ')}) found. This will be supported soon!`);
                  this.isProcessing = false;
                } else {
                  //3. Fetch and decrypt payload
                  const credentialIssuer = matchingCredentialIssuers[0];
                  const encryptedCredential = await this.getCredentialsForIssuer(account, credentialIssuer.wideInternalId);
                  const decryptedCredential = await this.decryptCredential(encryptedCredential.payload);

                  //4. Process request
                  const processedCredential = await this.processCredential(credentialIssuer, encryptedCredential, decryptedCredential);

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

  async processCredential(issuer: any, encryptedCredential: any, decryptedCredential: any): Promise<any> {
    const serverPubKey = await this.web3WalletService.getServerPublicKey();

    let vc = {
      "id": "http://wid3.xyz",
      "type": ["WIDECredential"],
      "issuer": serverPubKey,
      "issuanceDate": new Date().toISOString(),
      "credentialSubject": {
        "id": issuer.credentialSubject.id,
        "dataTypes": {
          "type": "credentialSources",
          "name": "Original Credential Sources",
          "value": [issuer.type]
        },
        "requestedBy": this.presentationConfig.rpName,
        "issuerDomains": [
          {
            "id": issuer.id,
            "name": issuer.issuer,
            "label": issuer.label,
            "type": issuer.type,
            "data": {
              "payloadKeccak256CipherText": this.web3WalletService.hashTextKeccak256(encryptedCredential.payload.ciphertext),
              "credentials": [] as any[]
            }
          }
        ]
      }
    }

    const requiredCredentialsPlainText = this.presentationConfig.require.plainText;
    requiredCredentialsPlainText.forEach((c: any) => {
      vc.credentialSubject.issuerDomains[0].data.credentials.push({
        "name": c,
        "value": decryptedCredential[c],
        "type": "plainText"
      });
    });

    const requiredCredentialsProof = this.presentationConfig.require.proofOf;
    requiredCredentialsProof.forEach((c: any) => {
      vc.credentialSubject.issuerDomains[0].data.credentials.push({
        "name": c,
        "value": this.web3WalletService.hashDataKeccak256(encryptedCredential.credentials.filter((encryptedCred: any) => encryptedCred.name == c)[0].val.ciphertext),
        "type": "proof"
      });
    });

    const requiredCredentialsPredicate = this.presentationConfig.require.predicate;
    requiredCredentialsPredicate.forEach((c: any) => {
      //TODO: Explore methods for allowing RP to verify without knowing the data
      //e.g. record a hash of the original value, and predicate result, or by 
      //asking the user to sign a message attesting to the predicate
      vc.credentialSubject.issuerDomains[0].data.credentials.push({
        "name": c.property,
        "value": this.evalPredicate(c, decryptedCredential[c.property]),
        "type": "predicate",
        "predicate": `${c.property} ${c.op} '${c.value}'`
      });
    });

    return vc;
  }

  //Very basic implementation for now that will be developed on a case by case basis
  evalPredicate(predicateDefinition: any, decryptedValue: any): any {
    switch (predicateDefinition.op) {
      case 'endsWith':
        return decryptedValue.endsWith(predicateDefinition.value);
      default:
        console.error('unable to evaluate predicate: ', predicateDefinition);
        return false;
    }
  }
  //TODO: Put in dedicated service.
  findMatchingCredentials(issuedCredentials: any[], presentationConfig: any): any[] {
    return issuedCredentials.filter(cred => {
      // Convert all elements to lowercase and sort
      const sortedCredTypes = cred.type.map((type: any) => type.toLowerCase()).sort();
      const sortedPresentationCreds = presentationConfig.credential.map((cred: any) => cred.toLowerCase()).sort();

      // Compare the JSON string representations of the sorted arrays
      return JSON.stringify(sortedCredTypes) === JSON.stringify(sortedPresentationCreds);
    });
  }

  //TODO: Duplicate code with main, put in dedicated service.
  async decryptCredential(payload: any): Promise<any> {

    const response: any = await this.web3WalletService.decryptData(payload);
    const decryptedData: any = JSON.parse(response);

    this.toastNotificationService.info('Successful Decryption', 'Successfully decrypted all credentials');

    return decryptedData;
  }

  //TODO: Duplicate code with main, put in dedicated service.
  async getCredentialsForIssuer(account: string, issuerInternalId: string): Promise<any | null> {
    try {
      const response: HttpResponse<any> = await firstValueFrom(
        this.wideStorageService.getEncryptedCredentials(account, issuerInternalId)
      );

      const credentialDetail = response.body;

      if (response.status === 204) {
        this.toastNotificationService.info('Loading credentials', `No credentials found for ${account} with key ${issuerInternalId}`);
      }

      return credentialDetail;
    } catch (error: any) {
      this.toastNotificationService.error(error.statusText, `Failed to load credentials (${error.status})`);
      console.error('Failed to load credentials', error);
      return null;
    }
  }

}
