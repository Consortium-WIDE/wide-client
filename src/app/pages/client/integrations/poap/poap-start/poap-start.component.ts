import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Web3WalletService } from '../../../../../services/web3-wallet.service';
import { PoapService } from '../../../../../services/poap.service';
import { firstValueFrom } from 'rxjs';
import { ethers } from 'ethers';
import { PoapDataComponent } from '../poap-data/poap-data.component';
import { NavMenuService } from '../../../../../services/nav-menu.service';

@Component({
  selector: 'app-poap-start',
  standalone: true,
  imports: [CommonModule, PoapDataComponent],
  templateUrl: './poap-start.component.html',
  styleUrl: './poap-start.component.scss'
})
export class PoapStartComponent implements OnInit {
  network: string | null = null;
  poaps: any;

  constructor(private web3WalletService: Web3WalletService, private navMenuService: NavMenuService, private poapService: PoapService) { }

  ngOnInit(): void {
    this.navMenuService.setPageDetails(`Claim POAP`, ['Your credentials', 'Add credentials', `Claim POAP`]);
  }

  async selectProvider(network: string): Promise<void> {
    this.network = network;

    let account = await this.web3WalletService.getAccount();

    if (account) {
      let response = await firstValueFrom(this.poapService.getPoapsOwned(account, network));
      this.poaps = response?.data?.accounts[0]?.tokens;
    }
  }
}
