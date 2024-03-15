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
      //const response = await firstValueFrom(this.daoHausService.getData(this.account));
      //this.daos = response.data.daos;
      const daoResponse: any = [
        {
          "__typename": "Dao",
          "id": "0x8ed5d6b07142855b45f8310cf271fc244eafd1c5",
          "name": "WIDE",
          "activeMemberCount": "4",
          "createdAt": "1709902330",
          "createdBy": "0x7bc48221928f11184b376da7a57650768dfd3332",
          "safeAddress": "0x1750600ec1a15576fb270453fe8827d20119c4ba",
          "sharesAddress": "0xe5b22fa95df9db568523a8f4748aae57ee2a8d8e",
          "shareTokenName": "WIDE",
          "shareTokenSymbol": "vWIDE",
          "txHash": "0x8bdfda4b3346be6e79ee82d33a10e02e2ec999868bb7a012b675216863dea708",
          "totalShares": "4000000000000000000",
          "members": [
            {
              "__typename": "Member",
              "id": "0x8ed5d6b07142855b45f8310cf271fc244eafd1c5-member-0x4e3a5626654b38a612eb10ce549da220797db2ac",
              "createdAt": "1709902330",
              "memberAddress": "0x4e3a5626654b38a612eb10ce549da220797db2ac",
              "shares": "1000000000000000000",
              "loot": "1000000000000000000"
            }
          ]
        },
        {
          "__typename": "Dao",
          "id": "0xd84d75ca8b783b48236dec78d0b3bc0ebf95089e",
          "name": "SHORT",
          "activeMemberCount": "4",
          "createdAt": "1709902455",
          "createdBy": "0x7bc48221928f11184b376da7a57650768dfd3332",
          "safeAddress": "0x718be84c3b9785af475abc7d1d6715ea2ff38311",
          "sharesAddress": "0xff2a7610a3b4df1bee3c97041697ac19edd3dfaa",
          "shareTokenName": "SHORT",
          "shareTokenSymbol": "vSHORT",
          "txHash": "0x5927403fca919859a727e85b73b1e2213bd40c09855dbe5fcc113dba6c2eefc5",
          "totalShares": "4000000000000000000",
          "members": [
            {
              "__typename": "Member",
              "id": "0xd84d75ca8b783b48236dec78d0b3bc0ebf95089e-member-0x4e3a5626654b38a612eb10ce549da220797db2ac",
              "createdAt": "1709902455",
              "memberAddress": "0x4e3a5626654b38a612eb10ce549da220797db2ac",
              "shares": "1000000000000000000",
              "loot": "1000000000000000000"
            }
          ]
        }
      ]

      this.daos = daoResponse.map((d: any) => ({ expanded: false, data: d }));

      console.log('daos', this.daos);
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
