import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgDetailComponent } from './rg-detail.component';

describe('RgDetailComponent', () => {
  let component: RgDetailComponent;
  let fixture: ComponentFixture<RgDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RgDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RgDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
