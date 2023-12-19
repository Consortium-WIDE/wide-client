import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu.component';
import { RouterOutlet } from '@angular/router';
import { NavHeaderComponent } from '../../components/nav-header/nav-header.component';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from '../../services/breadcrumb.service';

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

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbSubscription = this.breadcrumbService.currentBreadcrumbs.subscribe(breadcrumbs => {
      this.breadcrumbs = breadcrumbs;
    });
  }

  ngOnDestroy() {
    if (this.breadcrumbSubscription) {
      this.breadcrumbSubscription.unsubscribe();
    }
  }
}
