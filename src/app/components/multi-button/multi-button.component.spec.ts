import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiButtonComponent } from './multi-button.component';

describe('MultiButtonComponent', () => {
  let component: MultiButtonComponent;
  let fixture: ComponentFixture<MultiButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
