import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavMenuItemComponent } from './nav-menu-item/nav-menu-item.component';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, NavMenuItemComponent],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent {

  logout(event: any): void {
    alert('Logout: TODO');
    event.preventDefault();
  }
}
