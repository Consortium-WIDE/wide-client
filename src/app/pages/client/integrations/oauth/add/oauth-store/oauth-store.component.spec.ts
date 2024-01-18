import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthStoreComponent } from './oauth-store.component';

describe('OauthStoreComponent', () => {
  let component: OauthStoreComponent;
  let fixture: ComponentFixture<OauthStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthStoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OauthStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
