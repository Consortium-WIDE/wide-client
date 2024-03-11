import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupUpdateStartComponent } from './popup-update-start.component';

describe('PopupUpdateStartComponent', () => {
  let component: PopupUpdateStartComponent;
  let fixture: ComponentFixture<PopupUpdateStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupUpdateStartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupUpdateStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
