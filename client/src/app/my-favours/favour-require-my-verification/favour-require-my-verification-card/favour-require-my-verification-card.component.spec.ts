import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavourRequireMyVerificationCardComponent } from './favour-require-my-verification-card.component';

describe('FavourRequireMyVerificationCardComponent', () => {
  let component: FavourRequireMyVerificationCardComponent;
  let fixture: ComponentFixture<FavourRequireMyVerificationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavourRequireMyVerificationCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavourRequireMyVerificationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
