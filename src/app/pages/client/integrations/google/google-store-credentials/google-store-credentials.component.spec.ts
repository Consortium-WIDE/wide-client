import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleStoreCredentialsComponent } from './google-store-credentials.component';

describe('GoogleStoreCredentialsComponent', () => {
  let component: GoogleStoreCredentialsComponent;
  let fixture: ComponentFixture<GoogleStoreCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleStoreCredentialsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoogleStoreCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
