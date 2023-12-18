import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-menu-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-menu-item.component.html',
  styleUrl: './nav-menu-item.component.scss'
})
export class NavMenuItemComponent {
  @Input() text: string = ''
  @Input() url: string = '/'
  @Input() class: string = '';
  @Output() menuItemClickEvent = new EventEmitter<any>();

  constructor(private router: Router) {
  }

  get isActive(): boolean {
    return this.router.url === this.url;
  }

  click(event: any) {
    this.menuItemClickEvent.emit(event);
  }
}
