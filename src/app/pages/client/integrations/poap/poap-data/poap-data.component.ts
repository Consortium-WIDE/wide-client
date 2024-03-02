import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PoapService } from '../../../../../services/poap.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastNotificationService } from '../../../../../services/toast-notification.service';
import { Web3WalletService } from '../../../../../services/web3-wallet.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { NavMenuService } from '../../../../../services/nav-menu.service';

@Component({
  selector: 'app-poap-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './poap-data.component.html',
  styleUrl: './poap-data.component.scss'
})
export class PoapDataComponent implements OnInit {
  @Input({ required: true }) poap: any;
  @Input({ required: true }) provider: string = '';

  constructor(private navMenuService: NavMenuService, private router: Router, private http: HttpClient, private poapService: PoapService, private toastNotificationService: ToastNotificationService, private web3WalletService: Web3WalletService) { }

  async ngOnInit(): Promise<void> {
    this.navMenuService.setPageDetails(`Claim POAP`, ['Your credentials', 'Add credentials', `Claim POAP`]);

    if (!this.poap.data) {
      this.poapService.getTokenUri(this.poap.id).then(async (tokenUri) => {
        this.poap.data = await firstValueFrom(this.http.get(tokenUri));
      }).catch((error: any) => {
        console.error('getTokenUri failed', error);
      });
    }
  }

  async expand(poap: any) {
    if (!this.poap) {
      this.toastNotificationService.info('Unable to retrieve POAP', 'Please make sure your wallet is connected first');
      return;
    }

    if (poap.expanded === undefined) {
      poap.expanded = true;
    } else {
      poap.expanded = !poap.expanded;
    }
  }

  convertObjectToArray(obj: Record<string, any>): { key: string, value: any }[] {
    return Object.keys(obj).map(key => ({ key, value: obj[key] }));
  }

  async claimPoap(poap: any) {
    const accountAddress = await this.web3WalletService.getAccount();

    if (!accountAddress) {
      this.toastNotificationService.error('Error', 'Cannot find wallet address');
      return;
    }

    const eventUrl = this.poap.data.attributes.filter((att: any) => att.trait_type == 'eventURL' )[0].value;

    const issuerPayload = {
      "label": `POAP (${this.provider})`.trim(),
      "id": `${environment.wideDomain}/schemas/poap`,
      "type": ["POAP", this.provider],
      "issuer": "https://poap.xyz",
      "issuanceDate": new Date().toISOString(),
      "credentialSubject": {
        "id": accountAddress,
        "eventUrl": eventUrl
      }
    }

    const encryptedData = await this.web3WalletService.encryptPayload(poap);

    if (!encryptedData) {
      console.log('Unable to encrypt');
      this.toastNotificationService.error('Error', 'Unable to encrypt your data');
    } else {

      this.toastNotificationService.info('Success', 'Successfully encrypted your data');

      const navigationExtras = {
        state: {
          accountAddress: accountAddress,
          issuer: issuerPayload,
          rawDataHash: this.web3WalletService.hashDataKeccak256(poap),
          encryptedData: encryptedData
        }
      };

      console.log('navigationExtras', navigationExtras);

      this.router.navigate(['credentials/poap/store'], navigationExtras);
    }
  }

  convertUnixTimestamp(unixTimestamp: any): Date {
    return new Date(unixTimestamp * 1000);
  }
}
