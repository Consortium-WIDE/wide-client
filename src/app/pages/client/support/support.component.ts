import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuService } from '../../../services/nav-menu.service';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent implements OnInit {

  constructor(private navMenuService: NavMenuService) { }

  async ngOnInit(): Promise<void> {
    this.navMenuService.setPageDetails('Support', []);
  }
}
