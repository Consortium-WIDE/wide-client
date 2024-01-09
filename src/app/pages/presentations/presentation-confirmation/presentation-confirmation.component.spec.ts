import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationConfirmationComponent } from './presentation-confirmation.component';

describe('PresentationConfirmationComponent', () => {
  let component: PresentationConfirmationComponent;
  let fixture: ComponentFixture<PresentationConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentationConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PresentationConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
