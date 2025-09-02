import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedFavourCardComponent } from './completed-favour-card.component';

describe('CompletedFavourCardComponent', () => {
  let component: CompletedFavourCardComponent;
  let fixture: ComponentFixture<CompletedFavourCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedFavourCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedFavourCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
