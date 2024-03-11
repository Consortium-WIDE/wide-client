import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupStartComponent } from './popup-start.component';

describe('PopupStartComponent', () => {
  let component: PopupStartComponent;
  let fixture: ComponentFixture<PopupStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupStartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
