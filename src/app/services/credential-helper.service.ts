import { Injectable } from '@angular/core';
import { Web3WalletService } from './web3-wallet.service';
import { HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { WideStorageService } from './wide-storage.service';
import { ToastNotificationService } from './toast-notification.service';

@Injectable({
  providedIn: 'root'
})
export class CredentialHelperService {

  constructor(private web3WalletService: Web3WalletService, private wideStorageService: WideStorageService, private toastNotificationService: ToastNotificationService) { }

  evalPredicate(predicateDefinition: any, decryptedValue: any): any {
    switch (predicateDefinition.op) {
      case 'endsWith':
        return decryptedValue.endsWith(predicateDefinition.value);
      default:
        console.error('unable to evaluate predicate: ', predicateDefinition);
        return false;
    }
  }

  async processCredential(issuer: any, encryptedCredential: any, decryptedCredential: any, presentationConfig: any): Promise<any> {
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
        "requestedBy": presentationConfig.rpName,
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

    if (presentationConfig.require) {
      // Use this when the Relying Party is requesting a subset of credentials

      const requiredCredentialsPlainText = presentationConfig.require.plainText;
      if (requiredCredentialsPlainText) {
        requiredCredentialsPlainText.forEach((c: any) => {
          vc.credentialSubject.issuerDomains[0].data.credentials.push({
            "name": c,
            "value": decryptedCredential[c],
            "type": "plainText"
          });
        });
      }

      const requiredCredentialsProof = presentationConfig.require.proofOf;
      if (requiredCredentialsProof) {
        requiredCredentialsProof.forEach((c: any) => {
          vc.credentialSubject.issuerDomains[0].data.credentials.push({
            "name": c,
            "value": this.web3WalletService.hashDataKeccak256(encryptedCredential.credentials.filter((encryptedCred: any) => encryptedCred.name == c)[0].val.ciphertext),
            "type": "proof"
          });
        });
      }

      const requiredCredentialsPredicate = presentationConfig.require.predicate;
      if (requiredCredentialsPredicate) {
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
      }
    } else {
      // Since we're presenting the entire payload, mark every property as being presented in plainText
      // prior to attaching it to the vc.
      const credentialArray = Object.entries(decryptedCredential).map(([name, value]) => ({
        name,
        value,
        type: 'plainText'
      }));

      vc.credentialSubject.issuerDomains[0].data.credentials = credentialArray;
    }

    return vc;
  }

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

  async deleteCredentialsForIssuer(account: string, issuerInternalId: string): Promise<any | null> {
    try {
      const response: HttpResponse<any> = await firstValueFrom(
        this.wideStorageService.deleteCredential(account, issuerInternalId)
      );

      const credentialDetail = response.body;

      if (response.status === 204) {
        this.toastNotificationService.info('Delete credential', `Credential for ${account} with key ${issuerInternalId} has been removed from the WIDE servers.`);
      }

      return credentialDetail;
    } catch (error: any) {
      this.toastNotificationService.error(error.statusText, `Failed to remove credential (${error.status})`);
      console.error('Failed to remove credential', error);
      return null;
    }
  }

  async getCredentialIssuerById(account: string, wideInternalId: string): Promise<any> {
    return await firstValueFrom(this.wideStorageService.getCredentialByInternalId(account, wideInternalId));
  }

  findMatchingCredentials(issuedCredentials: any[], credentialFilter: any, partialMatch: boolean): any[] {
    return issuedCredentials.filter(issuedCredential => {
      const { type, credentialSubject } = issuedCredential;
      const testObj = { type, credentialSubject };

      return this.isSubsetOrEqual(testObj, credentialFilter, !partialMatch);
    })
  }

  isSubsetOrEqual(A: any, B: any, checkFullEquivalence: boolean = false): boolean {
    // Adjust for case-insensitive string comparison
    if (typeof A === 'string' && typeof B === 'string') {
      return A.toLowerCase() === B.toLowerCase();
    }

    // Check for primitive values (excluding strings, handled above)
    if (!(A instanceof Object) && !(B instanceof Object)) {
      return A === B;
    }
    // Check if both are arrays
    if (Array.isArray(A) && Array.isArray(B)) {
      if (checkFullEquivalence && A.length !== B.length) {
        return false; // Early return if lengths differ for full equivalence check
      }
      return B.every(b => A.some(a => this.isSubsetOrEqual(a, b, checkFullEquivalence))) &&
        (!checkFullEquivalence || A.every(a => B.some(b => this.isSubsetOrEqual(a, b, checkFullEquivalence))));
    }
    // Check if both are objects
    if (A instanceof Object && B instanceof Object) {
      const keysA = Object.keys(A);
      const keysB = Object.keys(B);
      if (checkFullEquivalence && keysA.length !== keysB.length) {
        return false; // Early return if key counts differ for full equivalence check
      }
      return keysB.every(key => A.hasOwnProperty(key) && this.isSubsetOrEqual(A[key], B[key], checkFullEquivalence)) &&
        (!checkFullEquivalence || keysA.every(key => B.hasOwnProperty(key) && this.isSubsetOrEqual(A[key], B[key], checkFullEquivalence)));
    }
    // If none of the above, they are not equal
    return false;
  }

  async decryptCredential(payload: any): Promise<any> {

    const response: any = await this.web3WalletService.decryptData(payload);
    const decryptedData: any = JSON.parse(response);

    this.toastNotificationService.info('Successful Decryption', 'Successfully decrypted all credentials');

    return decryptedData;
  }

}
