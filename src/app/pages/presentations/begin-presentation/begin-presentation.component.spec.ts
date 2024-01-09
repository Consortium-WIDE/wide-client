import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeginPresentationComponent } from './begin-presentation.component';

describe('BeginPresentationComponent', () => {
  let component: BeginPresentationComponent;
  let fixture: ComponentFixture<BeginPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeginPresentationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BeginPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
