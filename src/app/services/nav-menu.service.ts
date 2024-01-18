import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { deferExecution } from '../utils/deferExecution';

@Injectable({
  providedIn: 'root'
})
export class NavMenuService {

  private title = new BehaviorSubject<string>('');
  currentTitle = this.title.asObservable();

  private breadcrumbs = new BehaviorSubject<string[]>([]);
  currentBreadcrumbs = this.breadcrumbs.asObservable();

  constructor() { }

  setPageDetails(title: string, breadcrumbs: string[]) {
    deferExecution( () => {
      this.title.next(title);
      this.breadcrumbs.next(breadcrumbs);
    });
  }

  setTitle(title: string) {
    deferExecution(() => this.title.next(title));
  }

  setBreadcrumbs(breadcrumbs: string[]) {
    deferExecution(() => this.breadcrumbs.next(breadcrumbs));
  }

}
