import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Web3WalletService } from '../../../../../services/web3-wallet.service';
import { PoapService } from '../../../../../services/poap.service';
import { firstValueFrom } from 'rxjs';
import { ethers } from 'ethers';
import { PoapDataComponent } from '../poap-data/poap-data.component';

@Component({
  selector: 'app-poap-start',
  standalone: true,
  imports: [CommonModule, PoapDataComponent],
  templateUrl: './poap-start.component.html',
  styleUrl: './poap-start.component.scss'
})
export class PoapStartComponent {
  network: string | null = null;
  poaps: any;

  constructor(private web3WalletService: Web3WalletService, private poapService: PoapService) { }

  async selectProvider(network: string): Promise<void> {
    this.network = network;

    //let account = await this.web3WalletService.getAccount();
    //Temporary
    let account = '0x81865ebC7694Dfba6608F6503BBA50Abb04644b4';

    console.log('account', account);

    if (account) {
      let response = await firstValueFrom(this.poapService.getPoapsOwned(account, network));
      console.log('response', response);
      this.poaps = response?.data?.accounts[0]?.tokens;
      console.log('poaps', this.poaps);
    }
  }
}
