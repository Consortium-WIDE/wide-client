import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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

  click(event: any) {
    this.menuItemClickEvent.emit(event);
  }
}
