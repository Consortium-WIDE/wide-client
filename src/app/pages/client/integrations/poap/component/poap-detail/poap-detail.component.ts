import { Component, Input } from '@angular/core';
import { CapitalizeCamelCasePipe } from '../../../../../../pipes/capitalize-camel-case.pipe';
import { CommonModule } from '@angular/common';
import { UnixTimestampPipe } from '../../../../../../pipes/unix-timestamp.pipe';

@Component({
  selector: 'app-poap-detail',
  standalone: true,
  imports: [CommonModule, CapitalizeCamelCasePipe, UnixTimestampPipe],
  templateUrl: './poap-detail.component.html',
  styleUrl: './poap-detail.component.scss'
})
export class PoapDetailComponent {
  @Input({ required: true }) poap: any;
  @Input({ required: true }) provider: string = '';
}
