import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFavourComponent } from './view-favour.component';

describe('ViewFavourComponent', () => {
  let component: ViewFavourComponent;
  let fixture: ComponentFixture<ViewFavourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFavourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFavourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
