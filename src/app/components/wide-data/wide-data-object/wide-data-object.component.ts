import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wide-data-object',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wide-data-object.component.html',
  styleUrl: './wide-data-object.component.scss'
})
export class WideDataObjectComponent implements OnInit {
  @Input() data: any;
  expanded: { [key: string]: boolean } = {};

  constructor() { }

  ngOnInit(): void {
  }

  objectKeys = Object.keys;

  isObjectType(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }

  toggleExpand(key: string): void {
    this.expanded[key] = !this.expanded[key];
  }
}
