import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavourRequestsComponent } from './favour-requests.component';

describe('FavourRequestsComponent', () => {
  let component: FavourRequestsComponent;
  let fixture: ComponentFixture<FavourRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavourRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavourRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
