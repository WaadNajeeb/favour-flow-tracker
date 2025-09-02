import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFavourComponent } from './edit-favour.component';

describe('EditFavourComponent', () => {
  let component: EditFavourComponent;
  let fixture: ComponentFixture<EditFavourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFavourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFavourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
