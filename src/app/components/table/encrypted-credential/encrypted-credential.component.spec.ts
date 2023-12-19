import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncryptedCredentialComponent } from './encrypted-credential.component';

describe('EncryptedCredentialComponent', () => {
  let component: EncryptedCredentialComponent;
  let fixture: ComponentFixture<EncryptedCredentialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncryptedCredentialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EncryptedCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
