import { Component, Input } from '@angular/core';
import { UnixTimestampPipe } from '../../../../../pipes/unix-timestamp.pipe';
import { WeiToEthPipe } from '../../../../../pipes/wei-to-eth.pipe';

@Component({
  selector: 'app-rg-detail',
  standalone: true,
  imports: [UnixTimestampPipe, WeiToEthPipe],
  templateUrl: './rg-detail.component.html',
  styleUrl: './rg-detail.component.scss'
})
export class RgDetailComponent {
  @Input({ required: true }) dao: any;
}
