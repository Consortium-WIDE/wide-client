import { Component, OnInit } from '@angular/core';
import { DaohausService } from '../../../../../services/daohaus.service';
import { firstValueFrom } from 'rxjs';
import { Web3WalletService } from '../../../../../services/web3-wallet.service';
import { ToastNotificationService } from '../../../../../services/toast-notification.service';
import { NavMenuService } from '../../../../../services/nav-menu.service';
import { CommonModule } from '@angular/common';
import { UnixTimestampPipe } from '../../../../../pipes/unix-timestamp.pipe';
import { environment } from '../../../../../../environments/environment';
import { Router } from '@angular/router';
import { RgDetailComponent } from '../rg-detail/rg-detail.component';
import { DataProcessingService } from '../../../../../data-processing.service';
import { SmartRoundPipe } from '../../../../../pipes/smart-round.pipe';

@Component({
  selector: 'app-rg-start',
  standalone: true,
  imports: [CommonModule, UnixTimestampPipe, RgDetailComponent, SmartRoundPipe],
  templateUrl: './rg-start.component.html',
  styleUrl: './rg-start.component.scss'
})
export class RgStartComponent implements OnInit {
  account: string | null = null;
  daos: any;
  isLoading: boolean = true;

  constructor(private router: Router, private toastNotificationService: ToastNotificationService, private web3WalletService: Web3WalletService, private navMenuService: NavMenuService, private daoHausService: DaohausService, private dataProcessingService: DataProcessingService) { }

  async ngOnInit(): Promise<void> {
    this.navMenuService.setPageDetails(`Claim Raid Guild Membership`, ['Your credentials', 'Add credentials', `Claim Raid Guild Membership`]);

    this.web3WalletService.connectedToWallet$.subscribe(walletConnected => {
      if (walletConnected) {
        this.web3WalletService.getAccount()
          .then((account: any) => {
            this.account = account;
            this.querySubGraph();
          }).catch((error: any) => {
            console.error(error);
            this.isLoading = false;
            this.toastNotificationService.error('Error', 'Failed to fetch web3 account');
          });
      }
    });
  }

  async querySubGraph(): Promise<void> {
    if (this.account) {
      const response = await firstValueFrom(this.daoHausService.getData(this.account));
      this.daos = response.data.daos.map((d: any) => ({ expanded: false, data: d }));
    } else {
      this.toastNotificationService.error('Error', 'Unable to retrieve account address');
    }

    this.isLoading = false;
  }

  async claimDaoMembership(dao: any): Promise<void> {
    const issuerPayload = {
      "label": `DAO Haus - ${dao.name}`.trim(),
      "id": `${environment.wideDomain}/schemas/daohaus`,
      "type": ["DAOHaus", `${dao.name} DAO Member`],
      "issuer": "https://admin.daohaus.club",
      "issuanceDate": new Date().toISOString(),
      "credentialSubject": {
        "id": this.account,
        "daoName": dao.name
      }
    }
    
    const transformedDao = this.dataProcessingService.flattenJson(dao);

    const encryptedData = await this.web3WalletService.encryptPayload(transformedDao);

    if (!encryptedData) {
      console.log('Unable to encrypt');
      this.toastNotificationService.error('Error', 'Unable to encrypt your data');
    } else {

      this.toastNotificationService.info('Success', 'Successfully encrypted your data');

      const navigationExtras = {
        state: {
          accountAddress: this.account,
          issuer: issuerPayload,
          rawDataHash: this.web3WalletService.hashDataKeccak256(transformedDao),
          encryptedData: encryptedData,
          dao: dao,
          provider: "raidguild-membership"
        }
      };

      console.log('navigationExtras', navigationExtras);
      this.router.navigate(['credentials/raid-guild/store'], navigationExtras);
    }
  }

  getDaoUrl(id: string): string {
    return `https://admin.daohaus.club/#/molochv3/0x64/${id}`
  }
}
