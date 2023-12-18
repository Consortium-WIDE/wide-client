import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WideDropdownComponent } from './wide-dropdown.component';

describe('WideDropdownComponent', () => {
  let component: WideDropdownComponent;
  let fixture: ComponentFixture<WideDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WideDropdownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WideDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
