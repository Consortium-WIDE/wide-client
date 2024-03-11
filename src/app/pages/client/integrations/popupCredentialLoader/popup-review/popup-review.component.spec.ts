import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupReviewComponent } from './popup-review.component';

describe('PopupReviewComponent', () => {
  let component: PopupReviewComponent;
  let fixture: ComponentFixture<PopupReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
