import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuService } from '../../../services/nav-menu.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-credentials',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './add-credentials.component.html',
  styleUrl: './add-credentials.component.scss'
})
export class AddCredentialsComponent implements OnInit {

  constructor(private navMenuService: NavMenuService, private router: Router) { }

  ngOnInit() {
    this.navMenuService.setPageDetails('Add Credentials', ['Your credentials', 'Add credentails']);
  }
}
