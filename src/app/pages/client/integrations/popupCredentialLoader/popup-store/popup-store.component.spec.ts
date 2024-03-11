import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupStoreComponent } from './popup-store.component';

describe('PopupStoreComponent', () => {
  let component: PopupStoreComponent;
  let fixture: ComponentFixture<PopupStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupStoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
