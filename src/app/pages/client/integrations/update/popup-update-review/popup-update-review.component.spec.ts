import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupUpdateReviewComponent } from './popup-update-review.component';

describe('PopupUpdateReviewComponent', () => {
  let component: PopupUpdateReviewComponent;
  let fixture: ComponentFixture<PopupUpdateReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupUpdateReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupUpdateReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
