import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, NavMenuComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
