import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoapStoreComponent } from './poap-store.component';

describe('PoapStoreComponent', () => {
  let component: PoapStoreComponent;
  let fixture: ComponentFixture<PoapStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoapStoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoapStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
