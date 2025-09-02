import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwedFavourCardComponent } from './owed-favour-card.component';

describe('OwedFavourCardComponent', () => {
  let component: OwedFavourCardComponent;
  let fixture: ComponentFixture<OwedFavourCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwedFavourCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwedFavourCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
