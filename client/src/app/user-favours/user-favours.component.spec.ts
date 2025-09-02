import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFavoursComponent } from './user-favours.component';

describe('UserFavoursComponent', () => {
  let component: UserFavoursComponent;
  let fixture: ComponentFixture<UserFavoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFavoursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFavoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
