import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavourRequestCardComponent } from './favour-request-card.component';

describe('FavourRequestCardComponent', () => {
  let component: FavourRequestCardComponent;
  let fixture: ComponentFixture<FavourRequestCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavourRequestCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavourRequestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
