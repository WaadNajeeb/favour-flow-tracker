import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFavourComponent } from './create-favour.component';

describe('CreateFavourComponent', () => {
  let component: CreateFavourComponent;
  let fixture: ComponentFixture<CreateFavourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFavourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFavourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
