import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoapDetailComponent } from './poap-detail.component';

describe('PoapDetailComponent', () => {
  let component: PoapDetailComponent;
  let fixture: ComponentFixture<PoapDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoapDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoapDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
