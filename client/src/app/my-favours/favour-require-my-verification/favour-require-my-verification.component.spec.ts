import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavourRequireMyVerificationComponent } from './favour-require-my-verification.component';

describe('FavourRequireMyVerificationComponent', () => {
  let component: FavourRequireMyVerificationComponent;
  let fixture: ComponentFixture<FavourRequireMyVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavourRequireMyVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavourRequireMyVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
