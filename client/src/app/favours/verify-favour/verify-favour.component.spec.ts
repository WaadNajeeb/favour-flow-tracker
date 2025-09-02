import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyFavourComponent } from './verify-favour.component';

describe('VerifyFavourComponent', () => {
  let component: VerifyFavourComponent;
  let fixture: ComponentFixture<VerifyFavourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyFavourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyFavourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
