import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleSigninProcedureComponent } from './google-signin-procedure.component';

describe('GoogleSigninProcedureComponent', () => {
  let component: GoogleSigninProcedureComponent;
  let fixture: ComponentFixture<GoogleSigninProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleSigninProcedureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoogleSigninProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
