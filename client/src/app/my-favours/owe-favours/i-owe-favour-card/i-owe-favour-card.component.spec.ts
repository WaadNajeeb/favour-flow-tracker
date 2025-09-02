import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IOweFavourCardComponent } from './i-owe-favour-card.component';

describe('IOweFavourCardComponent', () => {
  let component: IOweFavourCardComponent;
  let fixture: ComponentFixture<IOweFavourCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IOweFavourCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IOweFavourCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
