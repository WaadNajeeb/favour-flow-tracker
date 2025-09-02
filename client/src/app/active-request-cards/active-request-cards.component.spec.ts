import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveRequestCardsComponent } from './active-request-cards.component';

describe('ActiveRequestCardsComponent', () => {
  let component: ActiveRequestCardsComponent;
  let fixture: ComponentFixture<ActiveRequestCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveRequestCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveRequestCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
