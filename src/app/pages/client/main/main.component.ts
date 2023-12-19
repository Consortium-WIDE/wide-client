import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from '../../../components/nav-menu/nav-menu.component';
import { NavHeaderComponent } from '../../../components/nav-header/nav-header.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, NavMenuComponent, NavHeaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  constructor() { }
}
