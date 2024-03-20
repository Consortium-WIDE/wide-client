import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgStoreComponent } from './rg-store.component';

describe('RgStoreComponent', () => {
  let component: RgStoreComponent;
  let fixture: ComponentFixture<RgStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RgStoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RgStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
