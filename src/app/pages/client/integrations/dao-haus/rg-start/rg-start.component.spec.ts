import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgStartComponent } from './rg-start.component';

describe('RgStartComponent', () => {
  let component: RgStartComponent;
  let fixture: ComponentFixture<RgStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RgStartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RgStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
