import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavMenuItemComponent } from './nav-menu-item/nav-menu-item.component';
import { environment } from '../../../environments/environment';
import { Web3WalletService } from '../../services/web3-wallet.service';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, NavMenuItemComponent],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent implements OnInit {
  menuItems: NavMenuItem[] = [
    { url: '/', text: 'Home', iconClass: 'mdi mdi-home' },
    { url: '/history', text: 'History', iconClass: 'mdi mdi-clock-outline' }
  ];

  constructor(private web3WalletService: Web3WalletService) { }

  ngOnInit(): void {
    if (!environment.production) {
      this.menuItems = this.menuItems.concat(
        [
          { url: '/dev/kitchen-sink', text: 'Kitchen Sink', iconClass: 'mdi mdi-countertop' },
          { url: '/dev/poc', text: 'Dev POC', iconClass: 'mdi mdi-memory' }
        ]
      );
    }
  }
  
  logout(event: any): void {
    this.web3WalletService.logout();
    event.preventDefault();
  }
}

export interface NavMenuItem {
  url: string;
  text: string;
  iconClass: string;
}
