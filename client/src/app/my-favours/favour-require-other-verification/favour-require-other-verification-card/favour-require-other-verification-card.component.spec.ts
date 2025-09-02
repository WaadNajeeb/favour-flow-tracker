import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavourRequireOtherVerificationCardComponent } from './favour-require-other-verification-card.component';

describe('FavourRequireOtherVerificationCardComponent', () => {
  let component: FavourRequireOtherVerificationCardComponent;
  let fixture: ComponentFixture<FavourRequireOtherVerificationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavourRequireOtherVerificationCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavourRequireOtherVerificationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
