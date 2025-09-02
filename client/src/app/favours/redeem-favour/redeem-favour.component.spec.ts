import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemFavourComponent } from './redeem-favour.component';

describe('RedeemFavourComponent', () => {
  let component: RedeemFavourComponent;
  let fixture: ComponentFixture<RedeemFavourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedeemFavourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedeemFavourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
