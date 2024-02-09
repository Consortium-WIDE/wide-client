import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuService } from '../../../services/nav-menu.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {

  constructor(private navMenuService: NavMenuService) { }

  async ngOnInit(): Promise<void> {
    this.navMenuService.setPageDetails('About', []);
  }

}
