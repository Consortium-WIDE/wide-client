import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TooltipComponent } from '../../../components/tooltip/tooltip.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-presentation-request',
  standalone: true,
  imports: [CommonModule, RouterLink, TooltipComponent],
  templateUrl: './presentation-request.component.html',
  styleUrl: './presentation-request.component.scss'
})
export class PresentationRequestComponent implements OnInit {
  domainOrigin: string = '';
  presentationConfig: any = null;
  pageLoaded: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const historyState = history.state;

    this.domainOrigin = historyState.domainOrigin;
    this.presentationConfig = historyState.presentationConfig;

    this.pageLoaded = true;
  }

  formatPredicates(predicates: any): any {
    return predicates.map((predicate: any) => {
      const key = Object.keys(predicate)[0];
      const details = predicate[key];
      return `${key} ${details.op} '${details.value}'`;
    });
  }

  reject() {
    window.location.href = this.presentationConfig.rejectUri ?? this.presentationConfig.sourceUri;
  }
}
