import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupUpdateStoreComponent } from './popup-update-store.component';

describe('PopupUpdateStoreComponent', () => {
  let component: PopupUpdateStoreComponent;
  let fixture: ComponentFixture<PopupUpdateStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupUpdateStoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupUpdateStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
