import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthProcedureUiComponent } from './oauth-procedure-ui.component';

describe('OauthProcedureUiComponent', () => {
  let component: OauthProcedureUiComponent;
  let fixture: ComponentFixture<OauthProcedureUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthProcedureUiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OauthProcedureUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
