import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from '../../../components/nav-menu/nav-menu.component';
import { Web3WalletService } from '../../../services/web3-wallet.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, NavMenuComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  accounts: string[] = [];

  constructor(private web3WalletService: Web3WalletService) { }
  ngOnInit(): void {
    if (this.web3WalletService.isConnectedToWallet()) {
      this.web3WalletService.getEthAddresses().then((addresses) => {
        if (addresses) {
          this.accounts = addresses;
        }
      }).catch((err) => console.error(err));
    } else {
      //TODO: Connect Flow!
    }
  }
}
