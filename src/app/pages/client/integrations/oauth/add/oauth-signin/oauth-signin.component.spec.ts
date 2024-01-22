import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthSigninComponent } from './oauth-signin.component';

describe('OauthSigninComponent', () => {
  let component: OauthSigninComponent;
  let fixture: ComponentFixture<OauthSigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthSigninComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OauthSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
