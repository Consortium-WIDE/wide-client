import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WideDataObjectComponent } from './wide-data-object.component';

describe('WideDataObjectComponent', () => {
  let component: WideDataObjectComponent;
  let fixture: ComponentFixture<WideDataObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WideDataObjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WideDataObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
