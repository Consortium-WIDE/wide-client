import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WideInputComponent } from './wide-input.component';

describe('WideInputComponent', () => {
  let component: WideInputComponent;
  let fixture: ComponentFixture<WideInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WideInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WideInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
