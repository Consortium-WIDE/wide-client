import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WideModalComponent } from './wide-modal.component';

describe('WideModalComponent', () => {
  let component: WideModalComponent;
  let fixture: ComponentFixture<WideModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WideModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WideModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
