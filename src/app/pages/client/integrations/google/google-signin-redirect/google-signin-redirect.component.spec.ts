import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleSigninRedirectComponent } from './google-signin-redirect.component';

describe('GoogleSigninRedirectComponent', () => {
  let component: GoogleSigninRedirectComponent;
  let fixture: ComponentFixture<GoogleSigninRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleSigninRedirectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoogleSigninRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
