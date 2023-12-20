import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { RouterOutlet } from '@angular/router';
import { NavHeaderComponent } from '../../components/nav-header/nav-header.component';
import { Subscription } from 'rxjs';
import { NavMenuService } from '../../services/nav-menu.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, NavMenuComponent, NavHeaderComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnDestroy {
  breadcrumbs: string[] = [];
  private breadcrumbSubscription: Subscription;

  title: string = '';
  private titleSubscription: Subscription;

  constructor(private navMenuService: NavMenuService) {
    this.breadcrumbSubscription = this.navMenuService.currentBreadcrumbs.subscribe(breadcrumbs => {
      this.breadcrumbs = breadcrumbs;
    });

    this.titleSubscription = this.navMenuService.currentTitle.subscribe(title => {
      this.title = title;
    })
  }

  ngOnDestroy() {
    if (this.breadcrumbSubscription) {
      this.breadcrumbSubscription.unsubscribe();
    }

    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
  }
}
