import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoapDataComponent } from './poap-data.component';

describe('PoapDataComponent', () => {
  let component: PoapDataComponent;
  let fixture: ComponentFixture<PoapDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoapDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoapDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
