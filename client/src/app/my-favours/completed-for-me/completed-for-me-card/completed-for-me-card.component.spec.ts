import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedForMeCardComponent } from './completed-for-me-card.component';

describe('CompletedForMeCardComponent', () => {
  let component: CompletedForMeCardComponent;
  let fixture: ComponentFixture<CompletedForMeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedForMeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedForMeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
