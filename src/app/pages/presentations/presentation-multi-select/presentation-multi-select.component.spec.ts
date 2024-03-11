import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationMultiSelectComponent } from './presentation-multi-select.component';

describe('PresentationMultiSelectComponent', () => {
  let component: PresentationMultiSelectComponent;
  let fixture: ComponentFixture<PresentationMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentationMultiSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PresentationMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
