import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoapStartComponent } from './poap-start.component';

describe('PoapStartComponent', () => {
  let component: PoapStartComponent;
  let fixture: ComponentFixture<PoapStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoapStartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoapStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
