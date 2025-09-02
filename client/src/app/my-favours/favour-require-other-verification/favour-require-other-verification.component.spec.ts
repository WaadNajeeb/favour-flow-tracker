import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavourRequireOtherVerificationComponent } from './favour-require-other-verification.component';

describe('FavourRequireOtherVerificationComponent', () => {
  let component: FavourRequireOtherVerificationComponent;
  let fixture: ComponentFixture<FavourRequireOtherVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavourRequireOtherVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavourRequireOtherVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
